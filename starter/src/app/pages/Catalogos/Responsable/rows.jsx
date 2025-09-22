// Import Dependencies
import PropTypes from 'prop-types';
import { Highlight } from "components/shared/Highlight";

// ----------------------------------------------------------------------

export function NombreCell({ getValue, column, table }) {
  const globalQuery = String(table.getState().globalFilter || '');
  const columnQuery = String(column.getFilterValue() || '');
  const nombre = String(getValue() || ''); // Asegura que siempre sea string

  return (
    <span className="font-medium text-gray-800 dark:text-dark-100">
      <Highlight query={[globalQuery, columnQuery]}>{nombre}</Highlight>
    </span>
  );
}

export function ParentescoCell({ getValue, column, table }) {
  const globalQuery = String(table.getState().globalFilter || '');
  const columnQuery = String(column.getFilterValue() || '');
  const parentesco = String(getValue() || ''); // Asegura que siempre sea string

  return (
    <span className="text-gray-600 dark:text-dark-300">
      <Highlight query={[globalQuery, columnQuery]}>{parentesco}</Highlight>
    </span>
  );
}

export function TelefonoCell({ getValue }) {
  return (
    <p className="text-sm+ font-medium text-gray-800 dark:text-dark-100">
      {String(getValue() || '')} {/* Asegura que siempre sea string */}
    </p>
  );
}

// Prop Types
NombreCell.propTypes = {
  getValue: PropTypes.func.isRequired,
  column: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
};

ParentescoCell.propTypes = {
  getValue: PropTypes.func.isRequired,
  column: PropTypes.object,
  table: PropTypes.object,
};

TelefonoCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};