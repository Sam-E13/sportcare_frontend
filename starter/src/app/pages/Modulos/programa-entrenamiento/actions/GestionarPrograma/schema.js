// Import Dependencies
import * as Yup from 'yup';

// ----------------------------------------------------------------------
// NOTA: No se necesitan dependencias de 'dayjs' para este esquema,
// así que se han omitido para mantener el código limpio.
// ----------------------------------------------------------------------

/**
 * Esquema de validación para un Ejercicio.
 * Corresponde al modelo `Ejercicio` de Django.
 */
export const ejercicioSchema = Yup.object().shape({
    nombre: Yup.string()
        .trim()
        .max(100, 'El nombre no puede exceder los 100 caracteres')
        .required('El nombre del ejercicio es requerido'),

    // --- CORRECCIÓN EN TODOS LOS CAMPOS NUMÉRICOS ---
    // El .transform() convierte un string vacío '' en null, evitando errores de validación.
    repeticiones: Yup.number()
        .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
        .nullable()
        .integer('Debe ser un número entero')
        .min(0, 'El valor no puede ser negativo'),
    series: Yup.number()
        .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
        .nullable()
        .integer('Debe ser un número entero')
        .min(0, 'El valor no puede ser negativo'),
    duracion_segundos: Yup.number()
        .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
        .nullable()
        .integer('Debe ser un número entero')
        .min(0, 'El valor no puede ser negativo'),
    distancia_metros: Yup.number()
        .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
        .nullable()
        .min(0, 'El valor no puede ser negativo'),
    peso_kg: Yup.number()
        .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
        .nullable()
        .min(0, 'El valor no puede ser negativo'),

    observaciones: Yup.string().trim().nullable(),
}).test(
    'at-least-one-metric',
    'Debes especificar al menos una métrica (repeticiones, duración, etc.)',
    (value) => {
        return (
            value.repeticiones != null ||
            value.series != null ||
            value.duracion_segundos != null ||
            value.distancia_metros != null ||
            value.peso_kg != null
        );
    }
);
/**
 * Esquema de validación para una Sesion de Entrenamiento.
 * Corresponde al modelo `SesionEntrenamiento` de Django.
 * Incluye un array de ejercicios.
 */
export const sesionEntrenamientoSchema = Yup.object().shape({
    dia: Yup.number()
        .integer('El día debe ser un número entero')
        .positive('El día debe ser un número positivo')
        .required('El día de la sesión es requerido'),
    titulo: Yup.string()
        .trim()
        .max(100, 'El título no puede exceder los 100 caracteres')
        .required('El título de la sesión es requerido'),
    descripcion: Yup.string()
        .trim()
        .required('La descripción de la sesión es requerida'),
    ejercicios: Yup.array()
        .of(ejercicioSchema) // Valida que cada elemento del array cumpla con el ejercicioSchema
        .min(1, 'Cada sesión debe tener al menos un ejercicio')
        .required('Debes agregar al menos un ejercicio a la sesión'),
});


/**
 * Esquema principal para el Programa de Entrenamiento.
 * Corresponde al modelo `ProgramaEntrenamiento` de Django.
 * Incluye un array anidado de sesiones de entrenamiento.
 */
export const programaEntrenamientoSchema = Yup.object().shape({
    nombre: Yup.string()
        .trim()
        .max(100, 'El nombre no puede exceder los 100 caracteres')
        .required('El nombre del programa es requerido'),
    descripcion: Yup.string()
        .trim()
        .required('La descripción es requerida'),
    deporte: Yup.mixed() // Puede ser string o number (ID)
        .nullable()
        .required('Debes seleccionar un deporte'), // Cambiado a requerido, si puede ser null, usa .nullable() sin .required()
    nivel: Yup.string()
        .oneOf(['básico', 'intermedio', 'avanzado'], 'Nivel no válido')
        .required('Debes seleccionar un nivel'),
    objetivo: Yup.string()
        .trim()
        .max(100, 'El objetivo no puede exceder los 100 caracteres')
        .required('El objetivo es requerido'),
    duracion_dias: Yup.number()
        .integer('La duración debe ser un número entero')
        .positive('La duración debe ser un número positivo')
        .required('La duración en días es requerida'),
    entrenador: Yup.mixed() // Puede ser string o number (ID)
        .required('Se debe especificar un entrenador'),
    archivo: Yup.mixed()
        .nullable()
        .test("fileSize", "El archivo no debe exceder los 10MB", (value) => {
            // Si no hay archivo (value es null), la validación pasa.
            // Si hay archivo, comprueba el tamaño.
            return !value || (value && value.size <= 10485760); // 10MB
        }),
    sesiones: Yup.array()
        .of(sesionEntrenamientoSchema) // Valida que cada elemento del array cumpla con el sesionEntrenamientoSchema
        .min(1, 'El programa debe tener al menos una sesión de entrenamiento')
        .required('Debes agregar al menos una sesión'),
});

export const programaInfoBasicaSchema = programaEntrenamientoSchema.pick([
    'nombre',
    'descripcion',
    'deporte',
    'nivel',
    'objetivo',
    'duracion_dias',
    'entrenador',
    'archivo'
]);