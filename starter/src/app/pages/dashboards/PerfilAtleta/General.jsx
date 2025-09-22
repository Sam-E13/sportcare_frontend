import { UserIcon, CakeIcon, IdentificationIcon, ScaleIcon, HeartIcon, TrophyIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Avatar } from "components/ui";

const SEXO_LABELS = {
  'M': 'Masculino',
  'F': 'Femenino'
};

export default function General({ atletaData, onEdit }) {
  return (
    <div className="w-full space-y-6">
      {/* Encabezado con Avatar y botón de editar */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <Avatar
          size={24}
          src={atletaData.user?.avatar || "/images/100x100.png"}
          classNames={{
            root: "ring-4 ring-primary-100 dark:ring-dark-600",
            display: "rounded-xl",
          }}
        />
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-50">
            {atletaData.nombre} {atletaData.apPaterno} {atletaData.apMaterno}
          </h2>
          <p className="text-gray-600 dark:text-dark-300">
            {atletaData.user?.email}
          </p>
        </div>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          Editar perfil
        </button>
      </div>

      {/* Secciones de información */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Columna 1 */}
        <div className="space-y-4">
          <Section title="Información Personal">
            <InfoField 
              label="Nombre"
              value={atletaData.nombre}
              icon={<UserIcon className="size-5" />}
            />
            <InfoField 
              label="Apellido Paterno"
              value={atletaData.apPaterno}
              icon={<UserIcon className="size-5" />}
            />
            <InfoField 
              label="Apellido Materno"
              value={atletaData.apMaterno}
              icon={<UserIcon className="size-5" />}
            />
            <InfoField 
              label="Fecha de Nacimiento"
              value={new Date(atletaData.fechaNacimiento).toLocaleDateString()}
              icon={<CakeIcon className="size-5" />}
            />
          </Section>

          <Section title="Documentos">
            <InfoField 
              label="CURP"
              value={atletaData.curp}
              icon={<IdentificationIcon className="size-5" />}
            />
            <InfoField 
              label="RFC"
              value={atletaData.rfc}
              icon={<IdentificationIcon className="size-5" />}
            />
          </Section>
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          <Section title="Detalles Personales">
            <InfoField 
              label="Sexo"
              value={SEXO_LABELS[atletaData.sexo] || atletaData.sexo}
              icon={<UserIcon className="size-5" />}
            />
            <InfoField 
              label="Estado Civil"
              value={atletaData.estadoCivil}
              icon={<ScaleIcon className="size-5" />}
            />
            <InfoField 
              label="Tipo de Sangre"
              value={atletaData.tipoSangre}
              icon={<HeartIcon className="size-5" />}
            />
          </Section>

          <Section title="Información deportiva">
            <InfoField 
              label="Categoria"
              value={atletaData.categorias_display || "No especificado"}
              icon={<TrophyIcon className="size-5" />}
            />
            <InfoField 
              label="Deportes"
              value={atletaData.deportes_display || "No especificado"}
              icon={<UserGroupIcon className="size-5" />}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}

// Componente de sección
function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-dark-500 bg-white dark:bg-dark-700 overflow-hidden">
      <div className="border-b border-gray-200 dark:border-dark-500 px-5 py-3 bg-gray-50 dark:bg-dark-600">
        <h3 className="font-medium text-gray-800 dark:text-dark-100">{title}</h3>
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

// Componente de campo de información (estilo similar a inputs desactivados)
function InfoField({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-500 dark:text-dark-400">
        {icon}
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-500 dark:text-dark-400 mb-1">
          {label}
        </label>
        <div className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-500 bg-gray-50 dark:bg-dark-600 text-gray-800 dark:text-dark-100">
          {value || 'No especificado'}
        </div>
      </div>
    </div>
  );
}