import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Configuración base de las APIs
const atletasApi = axios.create({
  baseURL: `${API_BASE_URL}/Catalogos/Atletas/`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const programaEntrenamientoApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Programas-Entrenamiento/`,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
});

const AsignacionProgramasApi = axios.create({
    baseURL: `${API_BASE_URL}/Modulos/Asignacion-de-Programas-de-Entrenamiento/`,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
});

// Interceptores para manejo de errores
const setupInterceptors = (apiInstance) => {
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error);
      if (error.response) {
        // El servidor respondió con un código de estado de error
        throw new Error(`Error ${error.response.status}: ${error.response.data?.message || 'Error del servidor'}`);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        throw new Error('No se pudo conectar con el servidor');
      } else {
        // Algo pasó al configurar la petición
        throw new Error('Error en la configuración de la petición');
      }
    }
  );
};

// Aplicar interceptores a todas las instancias
setupInterceptors(atletasApi);
setupInterceptors(programaEntrenamientoApi);
setupInterceptors(AsignacionProgramasApi);

// ===== ATLETAS =====
// Obtener todos los atletas
export const getAllAtletas = () => atletasApi.get('/');

// Obtener un atleta por ID
export const getAtletaById = (id) => atletasApi.get(`/${id}/`);


// ===== PROGRAMAS DE ENTRENAMIENTO =====
// Obtener todos los programas de entrenamiento
export const getAllProgramas = () => programaEntrenamientoApi.get('/');

// Obtener un programa por ID
export const getProgramaById = (id) => programaEntrenamientoApi.get(`/${id}/`);

// Obtener programas con filtros
export const getProgramasFiltered = (params) => programaEntrenamientoApi.get('/', { params });

// ===== ASIGNACIONES =====
// Crear una nueva asignación de programa
export const asignacionCreate = (asignacionData) => AsignacionProgramasApi.post('/', asignacionData);

// Obtener todas las asignaciones
export const getAllAsignaciones = () => AsignacionProgramasApi.get('/');

// Obtener asignaciones por atleta
export const getAsignacionesByAtleta = (atletaId) =>
  AsignacionProgramasApi.get('/', { params: { atleta: atletaId } });

// Obtener asignaciones por programa
export const getAsignacionesByPrograma = (programaId) =>
  AsignacionProgramasApi.get('/', { params: { programa: programaId } });

// Actualizar una asignación
export const updateAsignacion = (id, asignacionData) =>
  AsignacionProgramasApi.put(`/${id}/`, asignacionData);

// Eliminar una asignación
export const deleteAsignacion = (id) => AsignacionProgramasApi.delete(`/${id}/`);




