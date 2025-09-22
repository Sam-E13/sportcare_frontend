import PropTypes from "prop-types";

export function NombreCell({ getValue }) {
    const nombre = getValue();
    return (
        <span className="font-medium text-primary-600 dark:text-primary-400">
            {nombre || 'Sin nombre'}
        </span>
    );
}

export function GruposCell({ getValue }) {
    const grupos = getValue();
    
    // El campo grupos_display ya viene formateado desde el backend
    return (
        <span className="font-medium text-secondary-600 dark:text-secondary-400">
            {grupos || 'Sin grupos'}
        </span>
    );
}

export function DeportesCell({ getValue }) {
    const deportes = getValue();
    
    // El campo deportes_display ya viene formateado desde el backend
    return (
        <span className="font-medium text-secondary-600 dark:text-secondary-400">
            {deportes || 'Sin deportes'}
        </span>
    );
}

// Prop Types
NombreCell.propTypes = {
    getValue: PropTypes.func.isRequired,
};

GruposCell.propTypes = {
    getValue: PropTypes.func.isRequired,
};

DeportesCell.propTypes = {
    getValue: PropTypes.func.isRequired,
};