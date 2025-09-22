import PropTypes from "prop-types";

export function NombreCell({ getValue }) {
  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      {getValue()}
    </span>
  );
}

export function EdadMinCell({ getValue }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 text-black-800">
      {getValue()} años
    </span>
  );
}

export function EdadMaxCell({ getValue }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 text-black-800">
      {getValue()} años
    </span>
  );
}

export function RangoEdadCell({ row }) {
  const edadMin = row.original.edadMin;
  const edadMax = row.original.edadMax;
  
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 text-black-800">
      {edadMin}-{edadMax} años
    </span>
  );
}

// Prop Types
NombreCell.propTypes = {
  getValue: PropTypes.func,
};

EdadMinCell.propTypes = {
  getValue: PropTypes.func,
};

EdadMaxCell.propTypes = {
  getValue: PropTypes.func,
};

RangoEdadCell.propTypes = {
  row: PropTypes.object,
};