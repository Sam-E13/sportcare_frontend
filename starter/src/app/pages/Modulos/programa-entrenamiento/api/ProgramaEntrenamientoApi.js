import axios from "axios";

const programaEntrenamientoApi = axios.create({
    // Asegúrate que la URL base sea la correcta para tu API de Programas de Entrenamiento
    baseURL: 'http://127.0.0.1:8000/Catalogos/Programas-Entrenamiento/'
});



// --- Funciones para Programas de Entrenamiento ---

// Crear un nuevo programa de entrenamiento
export const createPrograma = (programaData) => {
    // Si es FormData, configurar headers apropiados
    if (programaData instanceof FormData) {
        return programaEntrenamientoApi.post('/', programaData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
    return programaEntrenamientoApi.post('/', programaData);
};
// Obtener todos los programas de entrenamiento
export const getAllProgramas = () => programaEntrenamientoApi.get('/');

// Obtener un programa de entrenamiento por su ID
export const getProgramaById = (id) => programaEntrenamientoApi.get(`${id}/`);

// Actualizar un programa de entrenamiento por su ID
export const updatePrograma = (id, programaData) => programaEntrenamientoApi.put(`${id}/`, programaData);

// Eliminar un programa de entrenamiento por su ID
export const deletePrograma = (id) => programaEntrenamientoApi.delete(`${id}/`);


// --- Funciones relacionadas (ej. para obtener datos para los formularios) ---

const EntrenadoresApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/Catalogos/Entrenadores'
})

// Obtener entrenadores 
export const getAllEntrenadores = () => EntrenadoresApi.get('/');

const DeportesApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/Catalogos/Deportes'
})


// Obtener deportes
export const getAllDeportes = () => DeportesApi.get('/')
    

// Obtener programas por el ID de un entrenador
export const getProgramasByEntrenador = (entrenadorId) => programaEntrenamientoApi.get(`/?entrenador=${entrenadorId}`);


// Obtener entrenador por ID de usuario
export const getEntrenadorByUserId = (userId) => EntrenadoresApi.get(`/?user=${userId}`);
