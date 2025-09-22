import PropTypes from "prop-types";

export function NombreCell({ getValue }) {
  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      {getValue()}
    </span>
  );
}
export function DireccionCell({ getValue }) {
  return (
    <span className="font-medium text-sm tracking-tighter">
      {getValue()}
    </span>
  );
}

export function CiudadCell({ getValue }) {
  return (
    <span className="font-medium text-sm tracking-tighter">
      {getValue()}
    </span>
  );
}

export function EstadoCell({ getValue }) {
  return (
    <span className="font-medium text-sm tracking-tighter">
      {getValue()}
    </span>
  );
}

export function PaisCell({ getValue }) {
  return (
    <span className="font-medium text-sm tracking-tighter">
      {getValue()}
    </span>
  );
}

// Prop Types
NombreCell.propTypes = {
  getValue: PropTypes.func,
};

DireccionCell.propTypes = {
  row: PropTypes.object,
};

CiudadCell.propTypes = {
  getValue: PropTypes.func,
};

EstadoCell.propTypes = {
  getValue: PropTypes.func,
};

PaisCell.propTypes = {
  getValue: PropTypes.func,
};