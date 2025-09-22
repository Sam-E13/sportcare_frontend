// Import Dependencies
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  XMarkIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserIcon,
  TrophyIcon,
  DocumentTextIcon,
  PlayIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

// Local Imports
import {
  Button,
  Badge,
  GhostSpinner,
} from "components/ui";
import { getProgramaById } from "./api/ProgramaEntrenamientoApi";

// ----------------------------------------------------------------------

// Componente para mostrar información general
function InformacionGeneral({ programa, fechaCreacion, horaCreacion }) {
  return (
    <div className="space-y-6">
      {/* Header con información principal */}
      <div className="rounded-lg bg-gradient-to-r from-primary-50 to-primary-100 p-4 dark:from-primary-900/20 dark:to-primary-800/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100">
              {programa.nombre}
            </h3>
            <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">
              {programa.descripcion || 'Sin descripción'}
            </p>
          </div>
          <Badge
            color="primary"
            className="ml-3 capitalize"
          >
            {programa.nivel}
          </Badge>
        </div>
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={TrophyIcon}
          label="Deporte"
          value={programa.deporte_nombre || 'No especificado'}
        />
        <InfoCard
          icon={CalendarDaysIcon}
          label="Duración"
          value={`${programa.duracion_dias} días`}
        />
        <InfoCard
          icon={UserIcon}
          label="Entrenador"
          value={programa.entrenador_nombre || 'No especificado'}
        />
        <InfoCard
          icon={DocumentTextIcon}
          label="Objetivo"
          value={programa.objetivo || 'No especificado'}
        />
      </div>

      {/* Archivo adjunto */}
      {(programa.archivo_url || programa.archivo) && (
        <div className="rounded-lg border border-gray-200 p-4 dark:border-dark-500">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-dark-100">
                Archivo adjunto
              </h4>
              <p className="text-sm text-gray-500 dark:text-dark-300">
                Material complementario del programa
              </p>
            </div>
            <Button
              as="a"
              href={programa.archivo_url || programa.archivo}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="sm"
            >
              Descargar
            </Button>
          </div>
        </div>
      )}

      {/* Información de creación - Solo mostrar si tenemos fecha */}
      {fechaCreacion !== "Fecha no disponible" && (
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-dark-800">
          <div className="flex items-center space-x-2">
            <ClockIcon className="size-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-dark-300">
              Creado el {fechaCreacion} a las {horaCreacion}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar sesiones y ejercicios
function SesionesEntrenamiento({ sesiones }) {
  const [selectedSesion, setSelectedSesion] = useState(null);

  if (!sesiones || sesiones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <PlayIcon className="size-12 text-gray-300 dark:text-dark-500" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-dark-100">
          Sin sesiones programadas
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-dark-300">
          Este programa aún no tiene sesiones de entrenamiento configuradas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Lista de sesiones */}
      <div className="space-y-3">
        {sesiones.map((sesion, index) => (
          <SesionCard
            key={index}
            sesion={sesion}
            isSelected={selectedSesion === index}
            onClick={() => setSelectedSesion(selectedSesion === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}

// Componente para cada tarjeta de sesión
function SesionCard({ sesion, isSelected, onClick }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-dark-500">
      <button
        onClick={onClick}
        className="w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-dark-800"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <Badge variant="soft" color="primary">
                Día {sesion.dia}
              </Badge>
              <h4 className="font-medium text-gray-900 dark:text-dark-100">
                {sesion.titulo}
              </h4>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-dark-300">
              {sesion.descripcion}
            </p>
            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-dark-400">
              <span>{sesion.ejercicios?.length || 0} ejercicios</span>
            </div>
          </div>
          <ChevronRightIcon
            className={clsx(
              "size-5 text-gray-400 transition-transform",
              isSelected && "rotate-90"
            )}
          />
        </div>
      </button>
      
      {/* Panel expandible con ejercicios */}
      <Transition
        show={isSelected}
        enter="transition-all duration-200 ease-out"
        enterFrom="max-h-0 opacity-0"
        enterTo="max-h-96 opacity-100"
        leave="transition-all duration-200 ease-in"
        leaveFrom="max-h-96 opacity-100"
        leaveTo="max-h-0 opacity-0"
      >
        <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-dark-500 dark:bg-dark-800">
          <h5 className="mb-3 font-medium text-gray-900 dark:text-dark-100">
            Ejercicios programados:
          </h5>
          <div className="space-y-3">
            {sesion.ejercicios?.map((ejercicio, idx) => (
              <EjercicioCard key={idx} ejercicio={ejercicio} />
            ))}
          </div>
        </div>
      </Transition>
    </div>
  );
}

// Componente para cada ejercicio
function EjercicioCard({ ejercicio }) {
  const formatExerciseDetails = (ej) => {
    const parts = [];
    if (ej.series) parts.push(`${ej.series} series`);
    if (ej.repeticiones) parts.push(`${ej.repeticiones} reps`);
    if (ej.peso_kg) parts.push(`${ej.peso_kg} kg`);
    if (ej.duracion_segundos) parts.push(`${ej.duracion_segundos}s`);
    if (ej.distancia_metros) parts.push(`${ej.distancia_metros}m`);
    return parts.join(' × ') || 'Sin métricas específicas';
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-dark-600 dark:bg-dark-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h6 className="font-medium text-gray-900 dark:text-dark-100">
            {ejercicio.nombre}
          </h6>
          <p className="mt-1 text-sm text-primary-600 dark:text-primary-400">
            {formatExerciseDetails(ejercicio)}
          </p>
          {ejercicio.observaciones && (
            <p className="mt-2 text-xs text-gray-500 dark:text-dark-400">
              {ejercicio.observaciones}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para tarjetas de información
function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-dark-500">
      <div className="flex items-center space-x-3">
        <div className="rounded-md bg-primary-100 p-2 dark:bg-primary-900/30">
          <Icon className="size-4 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-dark-100 truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProgramaEntrenamientoDrawer({ isOpen, close, row }) {
  const [programaCompleto, setProgramaCompleto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  // Como no tenemos created_at en el modelo, usaremos una fecha por defecto o la ocultaremos
  const fechaCreacion = "Fecha no disponible";
  const horaCreacion = "";

  // Cargar datos completos del programa cuando se abre el drawer
  useEffect(() => {
    if (isOpen && row?.original?.id) {
      setLoading(true);
      getProgramaById(row.original.id)
        .then(response => {
          setProgramaCompleto(response.data);
        })
        .catch(error => {
          console.error('Error al cargar programa completo:', error);
          // Usar datos básicos si falla la carga completa
          setProgramaCompleto(row.original);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, row?.original?.id, row.original]);

  const programa = programaCompleto || row.original;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={close}>
        <TransitionChild
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40"
        />

        <TransitionChild
          as={DialogPanel}
          enter="ease-out transform-gpu transition-transform duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in transform-gpu transition-transform duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="fixed right-0 top-0 flex h-full w-full max-w-2xl transform-gpu flex-col bg-white transition-transform duration-200 dark:bg-dark-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-dark-500">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                Programa de Entrenamiento
              </h2>
              <p className="text-sm text-gray-500 dark:text-dark-300">
                ID: #{programa.id}
              </p>
            </div>
            <Button
              onClick={close}
              variant="flat"
              isIcon
              className="size-8 rounded-full"
            >
              <XMarkIcon className="size-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <GhostSpinner className="mx-auto size-8 border-2" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-dark-300">
                    Cargando información completa...
                  </p>
                </div>
              </div>
            ) : (
              <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
                <TabList className="flex border-b border-gray-200 px-6 dark:border-dark-500">
                  <Tab className={({ selected }) =>
                    clsx(
                      "px-4 py-3 text-sm font-medium transition-colors focus:outline-none",
                      selected
                        ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-dark-300 dark:hover:text-dark-100"
                    )
                  }>
                    Información General
                  </Tab>
                  <Tab className={({ selected }) =>
                    clsx(
                      "px-4 py-3 text-sm font-medium transition-colors focus:outline-none",
                      selected
                        ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-dark-300 dark:hover:text-dark-100"
                    )
                  }>
                    Sesiones ({programa.sesiones?.length || 0})
                  </Tab>
                </TabList>

                <TabPanels className="flex-1 overflow-y-auto">
                  <TabPanel className="p-6">
                    <InformacionGeneral
                      programa={programa}
                      fechaCreacion={fechaCreacion}
                      horaCreacion={horaCreacion}
                    />
                  </TabPanel>
                  <TabPanel className="p-6">
                    <SesionesEntrenamiento sesiones={programa.sesiones} />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 dark:border-dark-500">
            <div className="flex justify-end space-x-3">
              
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

ProgramaEntrenamientoDrawer.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  row: PropTypes.object,
};

InformacionGeneral.propTypes = {
  programa: PropTypes.object.isRequired,
  fechaCreacion: PropTypes.string.isRequired,
  horaCreacion: PropTypes.string.isRequired,
};

SesionesEntrenamiento.propTypes = {
  sesiones: PropTypes.array,
};

SesionCard.propTypes = {
  sesion: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

EjercicioCard.propTypes = {
  ejercicio: PropTypes.object.isRequired,
};

InfoCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};