// Import Dependencies
import PropTypes from "prop-types";

export function NombreCell({ getValue }) {
    return (
        <span className="font-medium text-primary-600 dark:text-primary-400">
            {getValue()}
        </span>
    );
}

export function GrupoCell({ getValue }) {
    const grupoNombre = getValue();
    return (
        <span className="font-medium text-secondary-600 dark:text-secondary-400">
            {grupoNombre || 'Sin grupo'}
        </span>
    );
}

GrupoCell.propTypes = {
    getValue: PropTypes.func,
};

// Prop Types
NombreCell.propTypes = {
    getValue: PropTypes.func,
};

GrupoCell.propTypes = {
    getValue: PropTypes.func,
};