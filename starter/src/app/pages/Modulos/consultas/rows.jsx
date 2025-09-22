// Import Dependencies
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useLocaleContext } from "app/contexts/locale/context";
import { UserIcon, HeartIcon } from "@heroicons/react/24/outline";

// ----------------------------------------------------------------------

export function ProfesionalCell({ getValue }) {
  const profesionalNombre = getValue();
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
          <HeartIcon className="h-4 w-4 text-primary-600" />
        </div>
      </div>
      <div>
        <p className="font-medium text-gray-900 dark:text-dark-100">
          Dr. {profesionalNombre}
        </p>
        <p className="text-xs text-gray-500 dark:text-dark-400">
          Profesional de Salud
        </p>
      </div>
    </div>
  );
}

export function AtletaCell({ getValue }) {
  const atletaNombre = getValue();
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <UserIcon className="h-4 w-4 text-blue-600" />
        </div>
      </div>
      <div>
        <p className="font-medium text-gray-900 dark:text-dark-100">
          {atletaNombre}
        </p>
        <p className="text-xs text-gray-500 dark:text-dark-400">
          Paciente
        </p>
      </div>
    </div>
  );
}

export function DiagnosticoCell({ getValue }) {
  const diagnostico = getValue();
  
  // Función para limpiar HTML tags si las hay
  const cleanText = (htmlString) => {
    if (!htmlString) return 'Sin diagnóstico';
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || 'Sin diagnóstico';
  };

  const textoLimpio = cleanText(diagnostico);
  
  return (
    <div className="max-w-xs">
      <p className="text-sm text-gray-900 dark:text-dark-100 line-clamp-2" title={textoLimpio}>
        {textoLimpio}
      </p>
      {textoLimpio.length > 50 && (
        <p className="text-xs text-gray-400 dark:text-dark-400 mt-1">
          Ver más...
        </p>
      )}
    </div>
  );
}

export function TratamientoCell({ getValue }) {
  const tratamiento = getValue();
  
  // Función para limpiar HTML tags si las hay
  const cleanText = (htmlString) => {
    if (!htmlString) return 'Sin tratamiento';
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || 'Sin tratamiento';
  };

  const textoLimpio = cleanText(tratamiento);
  
  return (
    <div className="max-w-xs">
      <p className="text-sm text-gray-900 dark:text-dark-100 line-clamp-2" title={textoLimpio}>
        {textoLimpio}
      </p>
      {textoLimpio.length > 50 && (
        <p className="text-xs text-gray-400 dark:text-dark-400 mt-1">
          Ver más...
        </p>
      )}
    </div>
  );
}

export function DateCell({ getValue }) {
  const { locale } = useLocaleContext();
  const dateValue = getValue();
  
  if (!dateValue) {
    return (
      <div className="text-center">
        <p className="text-gray-400 dark:text-dark-400">Sin fecha</p>
      </div>
    );
  }
  
  const date = dayjs(dateValue).locale(locale).format("DD MMM YYYY");
  
  return (
    <div className="text-center">
      <p className="font-medium text-gray-900 dark:text-dark-100">{date}</p>
    </div>
  );
}

// Prop Types
ProfesionalCell.propTypes = {
  getValue: PropTypes.func,
};

AtletaCell.propTypes = {
  getValue: PropTypes.func,
};

DiagnosticoCell.propTypes = {
  getValue: PropTypes.func,
};

TratamientoCell.propTypes = {
  getValue: PropTypes.func,
};

DateCell.propTypes = {
  getValue: PropTypes.func,
};