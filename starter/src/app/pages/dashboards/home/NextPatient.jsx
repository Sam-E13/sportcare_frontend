// Import Dependencies
import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useAuthContext } from "app/contexts/auth/context";

// Local Imports
import { Avatar, Box, Button } from "components/ui";
import { useEffect, useState } from "react";
import { getProfesionalByUserId, getCitasByProfesionalId, getAtletaById } from "./api/profesional-user";

// ----------------------------------------------------------------------

export function NextPatient() {
  const { user } = useAuthContext();
  const [cita, setCita] = useState(null); // Próxima cita confirmada
  const [atleta, setAtleta] = useState(null); // Atleta de la próxima cita
  const [ultimaCitaCompletada, setUltimaCitaCompletada] = useState(null); // Última cita completada del atleta

  useEffect(() => {
    const fetchData = async () => {
      if ( !user || !user.id) {
        setCita(null);
        setAtleta(null);
        setUltimaCitaCompletada(null);
        return;
      }
      try {
        // 1. Obtener el profesional por el user.id
        const resProf = await getProfesionalByUserId(user.id);
        const profesional = Array.isArray(resProf.data) ? resProf.data[0] : resProf.data;
        if (!profesional || !profesional.id) {
          setCita(null);
          setAtleta(null);
          setUltimaCitaCompletada(null);
          return;
        }

        // 2. Obtener todas las citas de ese profesional
        const resCitas = await getCitasByProfesionalId(profesional.id);
        const citasDelProfesional = resCitas.data || [];
        
        // Filtrar solo las citas confirmadas del profesional
        const citasConfirmadasDelProfesional = citasDelProfesional.filter(c => c.estado === "Confirmada");

        // 3. Buscar la cita más próxima en fecha y hora
        const ahora = new Date();
        const citaProxima = citasConfirmadasDelProfesional
          .map(c => ({ ...c, fechaHora: new Date(`${c.slot_fecha}T${c.slot_hora_inicio}`) }))
          .filter(c => c.fechaHora >= ahora)
          .sort((a, b) => a.fechaHora - b.fechaHora)[0];

        setCita(citaProxima || null);

        // 4. Obtener datos del atleta de la cita próxima y su última cita completada
        if (citaProxima && citaProxima.atleta) {
          const resAtleta = await getAtletaById(citaProxima.atleta);
          const atletaData = Array.isArray(resAtleta.data) ? resAtleta.data[0] : resAtleta.data;
          setAtleta(atletaData || null);

          if (atletaData) {
            // Encontrar la última cita completada de ESTE atleta específico
            // Usamos todas las citas del profesional, filtramos por atleta y estado "Completada"
            const citasCompletadasDelAtleta = citasDelProfesional
              .filter(c => c.atleta === atletaData.id && c.estado === "Completada")
              .map(c => ({ ...c, fechaHoraCompletada: new Date(`${c.slot_fecha}T${c.slot_hora_inicio}`) }))
              .sort((a, b) => b.fechaHoraCompletada - a.fechaHoraCompletada); // Descendente para obtener la más reciente

            setUltimaCitaCompletada(citasCompletadasDelAtleta.length > 0 ? citasCompletadasDelAtleta[0] : null);
          } else {
            setUltimaCitaCompletada(null); // No hay datos del atleta
          }
        } else {
          setAtleta(null); // No hay cita próxima o no tiene atleta asignado
          setUltimaCitaCompletada(null);
        }
      } catch (error) {
        console.error("Error al cargar la próxima cita y datos del atleta:", error);
        setCita(null);
        setAtleta(null);
        setUltimaCitaCompletada(null);
      }
    };
    fetchData();
  }, [user]);

  // Utilidad para iniciales
  const getInitials = (nombre, apPaterno, apMaterno) => {
    return [nombre, apPaterno, apMaterno]
      .filter(Boolean)
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  if (!cita || !atleta) {
    return (
      <Box className="rounded-lg bg-info/10 px-4 pb-5 dark:bg-dark-800">
        <div className="flex h-14 min-w-0 items-center justify-between py-3">
          <h2 className="truncate text-sm+ font-medium tracking-wide text-gray-800 dark:text-dark-100">
            Próximo Paciente
          </h2>
          <ActionMenu />
        </div>
        <div className="text-center py-8 text-gray-400">No hay próximas citas confirmadas.</div>
      </Box>
    );
  }

  return (
    <Box className="rounded-lg bg-info/10 px-4 pb-5 dark:bg-dark-800">
      <div className="flex h-14 min-w-0 items-center justify-between py-3">
        <h2 className="truncate text-sm+ font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Próximo Paciente
        </h2>
        <ActionMenu />
      </div>

      <div className="space-y-4">
        {/* Información de la próxima cita */}
        <div className="flex justify-between items-start">
          <Avatar size={16}>
            {getInitials(atleta.nombre, atleta.apPaterno)}
          </Avatar>
          <div className="text-right">
            <p>{cita.fechaHora.toLocaleDateString()}</p>
            <p className="text-xl font-medium text-gray-800 dark:text-dark-100">
              {cita.fechaHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        
        {/* Nombre y motivo de la próxima cita */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            {`${atleta.nombre} ${atleta.apPaterno || ''} ${atleta.apMaterno || ''}`.trim()}
          </h3>
          {/* <p className="text-xs text-gray-400 dark:text-dark-300">Motivo Próxima Cita: {cita.motivo || "Checkup"}</p> */}
        </div>

        {/* Detalles del atleta */}
        <div className="space-y-1 text-xs+">
          <h4 className="text-sm font-medium text-gray-700 dark:text-dark-200 mt-3 mb-1">Detalles del Atleta:</h4>
          <div className="flex justify-between">
            <p className="font-medium text-gray-800 dark:text-dark-100">Fecha de Nacimiento:</p>
            <p className="text-right">{atleta.fechaNacimiento}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-gray-800 dark:text-dark-100">Sexo:</p>
            <p className="text-right">{atleta.sexo}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-gray-800 dark:text-dark-100">Deportes:</p>
            <p className="text-right">{atleta.deportes && atleta.deportes.join(', ')}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-gray-800 dark:text-dark-100">CURP:</p>
            <p className="text-right">{atleta.curp}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-gray-800 dark:text-dark-100">RFC:</p>
            <p className="text-right">{atleta.rfc}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-gray-800 dark:text-dark-100">Estado Civil:</p>
            <p className="text-right">{atleta.estadoCivil}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-gray-800 dark:text-dark-100">Tipo Sangre:</p>
            <p className="text-right">{atleta.tipoSangre}</p>
          </div>
        </div>

        {/* Última cita completada del atleta */}
        {ultimaCitaCompletada && (
          <div className="space-y-1 text-xs+ pt-3 mt-3 border-t border-gray-200 dark:border-dark-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Última Cita Completada:</h4>
            <div className="flex justify-between">
              <p className="font-medium text-gray-800 dark:text-dark-100">Fecha:</p>
              <p className="text-right">{new Date(ultimaCitaCompletada.slot_fecha + 'T' + ultimaCitaCompletada.slot_hora_inicio).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium text-gray-800 dark:text-dark-100">Hora:</p>
              <p className="text-right">{new Date(ultimaCitaCompletada.slot_fecha + 'T' + ultimaCitaCompletada.slot_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium text-gray-800 dark:text-dark-100">Área:</p>
              <p className="text-right">{ultimaCitaCompletada.area_nombre}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium text-gray-800 dark:text-dark-100">Observaciones:</p>
              <p className="text-right">{ultimaCitaCompletada.observaciones || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </Box>
  );
}

function ActionMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5"
    >
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className="size-8 rounded-full"
      >
        <EllipsisHorizontalIcon className="size-5" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <MenuItems className="absolute z-[100] mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                  focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Action</span>
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                  focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Another action</span>
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                  focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Other action</span>
              </button>
            )}
          </MenuItem>

          <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />

          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                  focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Separated action</span>
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
