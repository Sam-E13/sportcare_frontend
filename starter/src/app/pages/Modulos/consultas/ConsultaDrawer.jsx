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
  HeartIcon,
  DocumentTextIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import dayjs from "dayjs";

// Local Imports
import {
  Button,
  Badge,
  GhostSpinner,
} from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";

// ----------------------------------------------------------------------

// Componente para mostrar información general de la consulta
function InformacionGeneral({ consulta, fechaConsulta, horaConsulta }) {
  return (
    <div className="space-y-6">
      {/* Header con información principal */}
      <div className="rounded-lg bg-gradient-to-r from-primary-50 to-primary-100 p-4 dark:from-primary-900/20 dark:to-primary-800/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100">
              Consulta Médica
            </h3>
            <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">
              {consulta.motivo || 'Consulta general'}
            </p>
          </div>
          <Badge
            color="primary"
            className="ml-3"
          >
            ID: #{consulta.id}
          </Badge>
        </div>
      </div>

      {/* Grid de información básica */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={UserIcon}
          label="Atleta"
          value={consulta.atleta_nombre || 'No especificado'}
        />
        <InfoCard
          icon={HeartIcon}
          label="Profesional"
          value={consulta.profesional_salud_nombre || 'No especificado'}
        />
        <InfoCard
          icon={CalendarDaysIcon}
          label="Fecha"
          value={fechaConsulta}
          subtitle={horaConsulta}
        />
        <InfoCard
          icon={ClipboardDocumentListIcon}
          label="Cita Relacionada"
          value={consulta.cita_descripcion || 'No relacionada'}
        />
      </div>

      {/* Diagnóstico y Tratamiento */}
      <div className="space-y-4">
        <MedicalInfoCard
          title="Diagnóstico"
          content={consulta.diagnostico}
          icon={ExclamationTriangleIcon}
          color="red"
        />
        <MedicalInfoCard
          title="Tratamiento"
          content={consulta.tratamiento}
          icon={DocumentTextIcon}
          color="green"
        />
      </div>

      {/* Observaciones */}
      {consulta.observaciones && (
        <div className="rounded-lg border border-gray-200 p-4 dark:border-dark-500">
          <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-2">
            Observaciones Generales
          </h4>
          <p className="text-sm text-gray-600 dark:text-dark-300">
            {consulta.observaciones}
          </p>
        </div>
      )}

      {/* Información de fecha - Solo mostrar si tenemos fecha */}
      {fechaConsulta !== "Fecha no disponible" && (
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-dark-800">
          <div className="flex items-center space-x-2">
            <ClockIcon className="size-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-dark-300">
              Consulta realizada el {fechaConsulta} a las {horaConsulta}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar signos vitales y antecedentes
function SignosVitalesAntecedentes({ consulta }) {
  const signosVitales = [
    { label: 'Presión Arterial', value: consulta.presion_arterial, unit: 'mmHg' },
    { label: 'Frecuencia Cardíaca', value: consulta.frecuencia_cardiaca, unit: 'bpm' },
    { label: 'Frecuencia Respiratoria', value: consulta.frecuencia_respiratoria, unit: 'rpm' },
    { label: 'Temperatura', value: consulta.temperatura, unit: '°C' },
  ];

  return (
    <div className="space-y-6">
      {/* Signos Vitales */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
          Signos Vitales
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {signosVitales.map((signo, index) => (
            <VitalSignCard
              key={index}
              label={signo.label}
              value={signo.value}
              unit={signo.unit}
            />
          ))}
        </div>
      </div>

      {/* Antecedentes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
          Antecedentes
        </h3>
        
        {consulta.antecedentes_familiares && (
          <AntecedenteCard
            title="Antecedentes Familiares"
            content={consulta.antecedentes_familiares}
            color="blue"
          />
        )}
        
        {consulta.antecedentes_no_patologicos && (
          <AntecedenteCard
            title="Antecedentes No Patológicos"
            content={consulta.antecedentes_no_patologicos}
            color="green"
          />
        )}
        
        {!consulta.antecedentes_familiares && !consulta.antecedentes_no_patologicos && (
          <div className="text-center py-8">
            <DocumentTextIcon className="size-12 text-gray-300 dark:text-dark-500 mx-auto" />
            <h4 className="mt-4 text-lg font-medium text-gray-900 dark:text-dark-100">
              Sin antecedentes registrados
            </h4>
            <p className="mt-2 text-sm text-gray-500 dark:text-dark-300">
              No se han registrado antecedentes médicos para esta consulta.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para mostrar estudios médicos
function EstudiosMedicos({ estudios }) {
  const [selectedEstudio, setSelectedEstudio] = useState(null);

  if (!estudios || estudios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BeakerIcon className="size-12 text-gray-300 dark:text-dark-500" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-dark-100">
          Sin estudios realizados
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-dark-300">
          No se realizaron estudios médicos en esta consulta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
        Estudios Médicos ({estudios.length})
      </h3>
      
      {/* Lista de estudios */}
      <div className="space-y-3">
        {estudios.map((estudio, index) => (
          <EstudioCard
            key={estudio.id || index}
            estudio={estudio}
            isSelected={selectedEstudio === index}
            onClick={() => setSelectedEstudio(selectedEstudio === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}

// Componente para cada tarjeta de estudio
function EstudioCard({ estudio, isSelected, onClick }) {
  const { locale } = useLocaleContext();
  
  // Transformar el archivo si viene como string del backend
  const archivoTransformado = estudio.archivo && typeof estudio.archivo === 'string' 
    ? {
        name: estudio.archivo.split('/').pop(),
        url: estudio.archivo,
        isExisting: true
      }
    : estudio.archivo;
  
  const getTipoEstudioDisplay = (tipo) => {
    const tipos = {
      'LAB': 'Análisis de Laboratorio',
      'IMG': 'Estudio de Imagen',
      'CAR': 'Cardiología',
      'NEU': 'Neurológico',
      'ODO': 'Odontológico',
      'OFT': 'Oftalmológico',
      'OTR': 'Otros',
    };
    return tipos[tipo] || tipo;
  };

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
                {getTipoEstudioDisplay(estudio.tipo_estudio)}
              </Badge>
              <h4 className="font-medium text-gray-900 dark:text-dark-100">
                {estudio.nombre || 'Estudio sin nombre'}
              </h4>
            </div>
            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-dark-400">
              <span>
                Realizado: {dayjs(estudio.fecha_realizacion).locale(locale).format("DD MMM YYYY")}
              </span>
              {estudio.fecha_entrega && (
                <span>
                  Entrega: {dayjs(estudio.fecha_entrega).locale(locale).format("DD MMM YYYY")}
                </span>
              )}
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
      
      {/* Panel expandible con detalles del estudio */}
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
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-1">
                Resultados:
              </h5>
              <p className="text-sm text-gray-600 dark:text-dark-300">
                {estudio.resultado || 'No disponibles'}
              </p>
            </div>
            
            {estudio.observaciones && (
              <div>
                <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-1">
                  Observaciones:
                </h5>
                <p className="text-sm text-gray-600 dark:text-dark-300">
                  {estudio.observaciones}
                </p>
              </div>
            )}
            
            {(archivoTransformado || estudio.enlace) && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-dark-600">
                <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                  Archivo adjunto
                </span>
                {archivoTransformado?.url ? (
                  <a
                    href={archivoTransformado.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100 dark:border-dark-400 dark:hover:bg-dark-500"
                  >
                    Ver archivo
                  </a>
                ) : estudio.enlace ? (
                  <a
                    href={estudio.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100 dark:border-dark-400 dark:hover:bg-dark-500"
                  >
                    Ver enlace
                  </a>
                ) : (
                  <Button
                    variant="outlined"
                    size="sm"
                    disabled
                  >
                    Sin archivo
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Transition>
    </div>
  );
}

// Componente para tarjetas de información
function InfoCard({ icon: Icon, label, value, subtitle }) {
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
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-dark-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para información médica importante
function MedicalInfoCard({ title, content, icon: Icon, color }) {
  const colorClasses = {
    red: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    green: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    blue: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
  };

  const iconColorClasses = {
    red: 'text-red-600 dark:text-red-400',
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <div className={clsx('rounded-lg border p-4', colorClasses[color])}>
      <div className="flex items-start space-x-3">
        <div className="rounded-md bg-white/50 p-2 dark:bg-black/20">
          <Icon className={clsx('size-5', iconColorClasses[color])} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-2">
            {title}
          </h4>
          <p className="text-sm text-gray-700 dark:text-dark-200">
            {content || 'No especificado'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente para signos vitales
function VitalSignCard({ label, value, unit }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-dark-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-dark-300">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-dark-100">
            {value ? `${value} ${unit}` : 'No registrado'}
          </p>
        </div>
        <div className="rounded-full bg-primary-100 p-2 dark:bg-primary-900/30">
          <HeartIcon className="size-4 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    </div>
  );
}

// Componente para antecedentes
function AntecedenteCard({ title, content, color }) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
    green: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
  };

  return (
    <div className={clsx('rounded-lg border p-4', colorClasses[color])}>
      <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-2">
        {title}
      </h4>
      <p className="text-sm text-gray-700 dark:text-dark-200">
        {content}
      </p>
    </div>
  );
}

export function ConsultaDrawer({ isOpen, close, row }) {
  const { locale } = useLocaleContext();
  const [loading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  // Formatear fechas
  const fechaConsulta = row?.original?.fecha 
    ? dayjs(row.original.fecha).locale(locale).format("DD MMM YYYY")
    : "Fecha no disponible";
  const horaConsulta = row?.original?.fecha_consulta 
    ? dayjs(row.original.fecha).locale(locale).format("hh:mm A")
    : "";

  const consulta = row?.original || {};

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
                Consulta Médica
              </h2>
              <p className="text-sm text-gray-500 dark:text-dark-300">
                ID: #{consulta.id}
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
                    Signos Vitales
                  </Tab>
                  <Tab className={({ selected }) =>
                    clsx(
                      "px-4 py-3 text-sm font-medium transition-colors focus:outline-none",
                      selected
                        ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-dark-300 dark:hover:text-dark-100"
                    )
                  }>
                    Estudios ({consulta.estudios?.length || 0})
                  </Tab>
                </TabList>

                <TabPanels className="flex-1 overflow-y-auto">
                  <TabPanel className="p-6">
                    <InformacionGeneral
                      consulta={consulta}
                      fechaConsulta={fechaConsulta}
                      horaConsulta={horaConsulta}
                    />
                  </TabPanel>
                  <TabPanel className="p-6">
                    <SignosVitalesAntecedentes consulta={consulta} />
                  </TabPanel>
                  <TabPanel className="p-6">
                    <EstudiosMedicos estudios={consulta.estudios} />
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

ConsultaDrawer.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  row: PropTypes.object,
};

InformacionGeneral.propTypes = {
  consulta: PropTypes.object.isRequired,
  fechaConsulta: PropTypes.string.isRequired,
  horaConsulta: PropTypes.string.isRequired,
};

SignosVitalesAntecedentes.propTypes = {
  consulta: PropTypes.object.isRequired,
};

EstudiosMedicos.propTypes = {
  estudios: PropTypes.array,
};

EstudioCard.propTypes = {
  estudio: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

InfoCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

MedicalInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.oneOf(['red', 'green', 'blue']).isRequired,
};

VitalSignCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  unit: PropTypes.string.isRequired,
};

AntecedenteCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['blue', 'green']).isRequired,
};