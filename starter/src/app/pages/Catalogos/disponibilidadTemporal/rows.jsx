// Import Dependencies
import PropTypes from "prop-types";

export function NombreCell({ getValue }) {
  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      {getValue()}
    </span>
  );
}

export function DescripcionCell({ getValue }) {
  return (
    <p className="w-48 truncate text-xs+ xl:w-56 2xl:w-64">
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
