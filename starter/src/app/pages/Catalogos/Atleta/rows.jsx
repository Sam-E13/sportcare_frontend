import PropTypes from "prop-types";

export function NombreCompletoCell({ getValue }) {
  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      {getValue()}
    </span>
  );
}

export function SexoCell({ getValue }) {
  const sexo = getValue();
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 text-black-800">
      {sexo === 'M' ? 'Masculino' : 'Femenino'}
    </span>
  );
}

export function FechaNacimientoCell({ getValue }) {
  const fecha = new Date(getValue());
  return fecha.toLocaleDateString('es-MX');
}

export function CURPCell({ getValue }) {
  return (
    <span className="font-medium text-sm tracking-tighter">
      {getValue()}
    </span>
  );
}

export function RFCell({ getValue }) {
  return (
    <span className="font-medium text-sm tracking-tighter">
      {getValue()}
    </span>
  );
}



// Prop Types
NombreCompletoCell.propTypes = {
  getValue: PropTypes.func,
};

SexoCell.propTypes = {
  getValue: PropTypes.func,
};

FechaNacimientoCell.propTypes = {
  getValue: PropTypes.func,
};

CURPCell.propTypes = {
  getValue: PropTypes.func,
};

RFCell.propTypes = {
  getValue: PropTypes.func,
};
