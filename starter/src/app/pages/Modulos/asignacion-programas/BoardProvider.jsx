// Import Dependencies
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

// Local Imports
import { BoardContextProvider } from "./Board.context";
import { createRegistry } from "./utils";
import {
  getAllProgramas,
  getAllAtletas,
  getAllAsignaciones,
  asignacionCreate,
  updateAsignacion,
  deleteAsignacion,
} from "./api/asignacionProgramasApi";

// ----------------------------------------------------------------------

// Componente Wrapper para la lógica del tablero
export function BoardProvider({ children }) {
  // --- STATE MANAGEMENT ---
  const [programs, setPrograms] = useState([]); // Columnas
  const [athletes, setAthletes] = useState([]); // Todas las tarjetas
  const [assignments, setAssignments] = useState([]); // Relación entre atletas y programas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda

  const [registry] = useState(createRegistry);
  const [instanceId] = useState(() => Symbol("instance-id"));

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [programsRes, athletesRes, assignmentsRes] = await Promise.all([
        getAllProgramas(),
        getAllAtletas(),
        getAllAsignaciones(),
      ]);
      setPrograms(programsRes.data);
      setAthletes(athletesRes.data);
      setAssignments(assignmentsRes.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch board data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- DERIVED STATE & MEMOIZATION ---
  // Usamos useMemo para evitar recalcular estos datos en cada render
  const {
    unassignedAthletes,
    programColumns,
    athletesMap,
    assignmentsMap,
    filteredUnassignedAthletes,
    filteredProgramColumns,
  } = useMemo(() => {
    const athletesMap = new Map(athletes.map((athlete) => [athlete.id, athlete]));
    const assignmentsMap = new Map(assignments.map((ass) => [ass.atleta, ass]));

    const assignedAthleteIds = new Set(assignments.map((a) => a.atleta));

    const unassignedAthletes = athletes.filter(
      (athlete) => !assignedAthleteIds.has(athlete.id)
    );

    const programColumns = programs.map((program) => {
      const assignedTasks = assignments
        .filter((assignment) => assignment.programa === program.id)
        .map((assignment) => assignment.atleta); // Solo los IDs de los atletas

      return {
        ...program,
        tasks: assignedTasks,
      };
    });

    // Filtrar atletas basándose en el término de búsqueda
    const searchLower = searchTerm.toLowerCase().trim();
    
    const filterAthlete = (athlete) => {
      if (!searchLower) return true;
      const fullName = `${athlete.nombre} ${athlete.apPaterno} ${athlete.apMaterno}`.toLowerCase();
      return fullName.includes(searchLower);
    };

    const filteredUnassignedAthletes = unassignedAthletes.filter(filterAthlete);
    
    const filteredProgramColumns = programColumns.map((program) => {
      const filteredTasks = program.tasks.filter((athleteId) => {
        const athlete = athletesMap.get(athleteId);
        return athlete && filterAthlete(athlete);
      });
      
      return {
        ...program,
        tasks: filteredTasks,
      };
    });

    return {
      unassignedAthletes,
      programColumns,
      athletesMap,
      assignmentsMap,
      filteredUnassignedAthletes,
      filteredProgramColumns,
    };
  }, [programs, athletes, assignments, searchTerm]);

  // --- API ACTIONS ---
  const moveAthlete = useCallback(
    async ({ athleteId, startProgramId, finishProgramId }) => {
      // No hacer nada si se suelta en el mismo lugar
      if (startProgramId === finishProgramId) return;

      try {
        // Caso 1: Asignar un atleta desde la columna "Sin Asignar"
        if (startProgramId === "unassigned-athletes") {
          await asignacionCreate({
            atleta: athleteId,
            programa: finishProgramId,
            estado: "activo",
          });
        }
        // Caso 2: Mover un atleta a la columna "Sin Asignar" (des-asignar)
        else if (finishProgramId === "unassigned-athletes") {
          const assignment = assignmentsMap.get(athleteId);
          if (assignment) {
            await deleteAsignacion(assignment.id);
          }
        }
        // Caso 3: Mover un atleta entre dos programas
        else {
          const assignment = assignmentsMap.get(athleteId);
          if (assignment) {
            await updateAsignacion(assignment.id, {
              ...assignment,
              programa: finishProgramId,
            });
          }
        }
        // Refrescar los datos para mostrar el cambio
        fetchData();
        // Don't set lastMoved since the component will re-render with new data
        // setLastMoved({ athleteId });
      } catch (err) {
        console.error("Failed to move athlete:", err);
        // Opcional: mostrar un error al usuario
      }
    },
    [assignmentsMap, fetchData],
  );

  // --- DRAG-AND-DROP EFFECT ---
  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          return source.data.instanceId === instanceId;
        },
        onDrop(args) {
          const { location, source } = args;
          // Si no se suelta en un destino válido, no hacer nada
          if (!location.current.dropTargets.length) {
            return;
          }

          // Solo nos interesa arrastrar atletas (cards)
          if (source.data.type !== "card") {
            return;
          }

          const athleteId = source.data.cardId;
          const startProgramId = source.data.columnId;
          
          // --- INICIO DE LA CORRECCIÓN ---
          // Busca en la lista de destinos el que sea una columna (que tiene columnId)
          const destinationTarget = location.current.dropTargets.find(
            (target) => target.data.columnId
          );

          // Si no encontramos un destino de columna, no hacemos nada.
          if (!destinationTarget) {
            return;
          }

          const finishProgramId = destinationTarget.data.columnId;
          // --- FIN DE LA CORRECCIÓN ---

          invariant(typeof athleteId === "number" || typeof athleteId === "string", "athleteId must be a number or string");
          invariant(typeof startProgramId === "string", "startProgramId must be a string");
          invariant(typeof finishProgramId === "string", "finishProgramId must be a string");

          moveAthlete({
            athleteId,
            startProgramId,
            finishProgramId,
          });
        },
      }),
    );
  }, [instanceId, moveAthlete]);
    
  // --- POST-MOVE FLASH EFFECT ---
  // Disabled because components re-render after fetchData()
  // useEffect(() => {
  //   if (lastMoved === null) return;
  //   const { athleteId } = lastMoved;
  //   const entry = registry.getCard(athleteId);
  //   if(entry?.element) {
  //       triggerPostMoveFlash(entry.element);
  //   }
  //   setLastMoved(null);
  // }, [lastMoved, registry]);


  // --- CONTEXT VALUE ---
  const value = {
    loading,
    error,
    programColumns: searchTerm ? filteredProgramColumns : programColumns,
    unassignedAthletes: searchTerm ? filteredUnassignedAthletes : unassignedAthletes,
    athletesMap,
    instanceId,
    registerCard: registry.registerCard,
    registerColumn: registry.registerColumn,
    searchTerm,
    setSearchTerm,
    // Aquí podrías añadir funciones para CRUD si las necesitaras, pero por ahora no son necesarias.
  };

  return <BoardContextProvider value={value}>{children}</BoardContextProvider>;
}

BoardProvider.propTypes = {
  children: PropTypes.node,
};