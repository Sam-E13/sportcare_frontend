// Import Dependencies
import PropTypes from "prop-types";


// ----------------------------------------------------------------------

export function NombreCell({ getValue }) {
  return (
    <p className="font-medium text-gray-800 dark:text-dark-100">
      {getValue()}
    </p>
  );
}

export function DescripcionCell({ getValue }) {
  return (
    <p className="w-48 truncate text-xs+ xl:w-56 2xl:w-64">
      {getValue()}
    </p>
  );
}

export function DeporteCell({ getValue }) {
  return (
    <p className="font-medium text-gray-800 dark:text-dark-100">
      {getValue()}
    </p>
  );
}

export function NivelCell({ getValue }) {
  return (
    <p className="font-medium text-gray-800 dark:text-dark-100">
      {getValue()}
    </p>
  );
}

export function ObjetivoCell({ getValue }) {
  return (
    <p className="w-48 truncate text-xs+ xl:w-56 2xl:w-64">
      {getValue()}
    </p>
  );
}

export function DuracionCell({ getValue }) {
  return (
    <p className="font-medium text-gray-800 dark:text-dark-100">
      {getValue()} días
    </p>
  );
}

export function EntrenadorCell({ getValue }) {
  return (
    <p className="font-medium text-gray-800 dark:text-dark-100">
      {getValue()}
    </p>
  );
}

// Prop Types
NombreCell.propTypes = {
  getValue: PropTypes.func,
};

DescripcionCell.propTypes = {
  getValue: PropTypes.func,
};

DeporteCell.propTypes = {
  getValue: PropTypes.func,
};

NivelCell.propTypes = {
  getValue: PropTypes.func,
};

ObjetivoCell.propTypes = {
  getValue: PropTypes.func,
};

DuracionCell.propTypes = {
  getValue: PropTypes.func,
};

EntrenadorCell.propTypes = {
  getValue: PropTypes.func,
};
