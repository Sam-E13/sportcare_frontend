// Import Dependencies
import * as Yup from 'yup'

// Local Imports

// ----------------------------------------------------------------------

export const schema = Yup.object().shape({
  profesional_salud: Yup.string().required("Profesional de salud es requerido"),
  atleta: Yup.string().required("Atleta es requerido"),
  cita: Yup.string().nullable(), // Cita es opcional
  motivo: Yup.string()
    .trim()
    .min(10, "Motivo demasiado corto!")
    .max(500, "Motivo demasiado largo!")
    .required("Motivo es requerido"),
  diagnostico: Yup.string()
    .trim()
    .min(10, "Diagnóstico demasiado corto!")
    .max(500, "Diagnóstico demasiado largo!"),
  tratamiento: Yup.string()
    .trim()
    .min(10, "Tratamiento demasiado corto!")
    .max(500, "Tratamiento demasiado largo!"),
  observaciones: Yup.string()
    .trim()
    .max(1000, "Observaciones demasiado largas!"),
  estudios: Yup.array().of(
    Yup.object().shape({
      nombre: Yup.string().required("Nombre del estudio es requerido"),
      resultado: Yup.string().required("Resultado es requerido"),
    })
  ),
});
