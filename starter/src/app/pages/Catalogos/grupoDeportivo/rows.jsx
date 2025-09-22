// rows.jsx
import PropTypes from "prop-types";

export function NombreCell({ getValue}) {
    const nombre = getValue();
    return (
        <div className="flex items-center">
            <span className="font-medium text-gray-900 dark:text-dark-100">
                {nombre || 'Sin nombre'}
            </span>
        </div>
    );
}

export function DescripcionCell({ getValue}) {
    const descripcion = getValue();
    
    if (!descripcion || descripcion.trim() === '') {
        return (
            <span className="text-gray-400 dark:text-dark-300 italic text-sm">
                Sin descripción
            </span>
        );
    }

    // Truncar descripción si es muy larga
    const truncatedDescription = descripcion.length > 100 
        ? descripcion.substring(0, 100) + '...' 
        : descripcion;

    return (
        <div className="max-w-xs">
            <p className="text-sm text-gray-700 dark:text-dark-200 leading-relaxed">
                {truncatedDescription}
            </p>
            {descripcion.length > 100 && (
                <span className="text-xs text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">
                    Ver más
                </span>
            )}
        </div>
    );
}

NombreCell.propTypes = {
    getValue: PropTypes.func,
    row: PropTypes.object,
};

DescripcionCell.propTypes = {
    getValue: PropTypes.func,
    row: PropTypes.object,
};