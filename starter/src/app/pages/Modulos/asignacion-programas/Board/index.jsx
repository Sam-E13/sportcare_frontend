// Import Dependencies
import { Spinner } from "components/ui";
import { FaExclamationTriangle } from "react-icons/fa";

// Local Imports
import { useBoardContext } from "../Board.context";
import { Column } from "./Column";
import { UnassignedAthletesColumn } from "./UnassignedAthletesColumn";

// ----------------------------------------------------------------------

export function Board() {
  const { loading, error, programColumns, unassignedAthletes, athletesMap, searchTerm } =
    useBoardContext();

  if (loading) {
    return (
      <div className="grid h-[calc(100vh-16rem)] place-content-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="primary" />
          <p className="text-lg font-medium text-gray-600 dark:text-dark-300">
            Cargando información...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid h-[calc(100vh-16rem)] place-content-center">
        <div className="flex flex-col items-center gap-4 p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <FaExclamationTriangle className="size-12 text-red-500" />
          <div className="text-center">
            <p className="text-xl font-semibold text-red-700 dark:text-red-400">
              Ocurrió un error al cargar los datos
            </p>
            <p className="mt-2 text-gray-600 dark:text-dark-400">
              Por favor, revisa la conexión con el servidor y recarga la página.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Verificar si hay resultados cuando se está buscando
  const hasResults = searchTerm && (
    unassignedAthletes.length > 0 ||
    programColumns.some(col => col.tasks.length > 0)
  );

  const noResults = searchTerm && !hasResults;

  return (
    <div className="relative h-[calc(100vh-14rem)] supports-[height:1dvh]:h-[calc(100dvh-14rem)]">
      {noResults ? (
        <div className="grid h-full place-content-center">
          <div className="text-center p-8">
            <p className="text-lg text-gray-500 dark:text-dark-400">
              No se encontraron atletas que coincidan con &quot;{searchTerm}&quot;
            </p>
            <p className="mt-2 text-sm text-gray-400 dark:text-dark-500">
              Intenta con otro término de busqueda
            </p>
          </div>
        </div>
      ) : (
        <div
          className="custom-scrollbar h-full flex items-start gap-x-6 overflow-x-auto overflow-y-hidden px-[--margin-x] py-4"
          style={{
            "--scrollbar-size": "0.75rem",
            "--margin-scroll": "var(--margin-x)",
          }}
        >
          {/* Columna Estática para Atletas sin Asignar */}
          <div className="shrink-0">
            <UnassignedAthletesColumn athletes={unassignedAthletes} />
          </div>

          {/* Separador visual */}
          <div className="h-full w-px bg-gray-200 dark:bg-dark-700 shrink-0" />

          {/* Columnas Dinámicas para cada Programa */}
          {programColumns.map((program) => (
            <Column
              key={program.id}
              data={program}
              tasks={program.tasks.map(taskId => athletesMap.get(taskId)).filter(Boolean)}
            />
          ))}
          
          {/* Espacio al final para mejor scroll */}
          <div className="w-8 shrink-0" />
        </div>
      )}
    </div>
  );
}