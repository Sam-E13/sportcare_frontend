import axios from "axios";

const citasDisponiblesApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Citas-Disponibles/'
});

const profesionalesSaludApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Profesionales-Salud/'
});

const areasApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Areas/'
});

const consultoriosApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Consultorios/'
});

const citasApi = axios.create({
  baseURL: 'http://localhost:8000/Modulos/Citas/'
});

const atletasApi = axios.create({
  baseURL: 'http://localhost:8000/Catalogos/Atletas/'
});

export const getAtletaByUserId = (userId) => atletasApi.get(`/?user=${userId}`);

// Nueva función para obtener todos los atletas
export const getAllAtletas = () => {
  console.log('Llamando a getAllAtletas...');
  return atletasApi.get('/').then(response => {
    console.log('Respuesta de atletas:', response);
    return response;
  }).catch(error => {
    console.error('Error en getAllAtletas:', error);
    throw error;
  });
};

// AÑADIDA: Función para crear cita
export const createCita = (citaData, config = {}) => citasApi.post('/', citaData, config);

// Obtener todas las citas disponibles
export const getAllCitasDisponibles = (params = {}) => citasDisponiblesApi.get('/', { params });

// Obtener citas por filtros
export const getCitasDisponiblesByFilters = (filters) => {
  const params = {};
  
  if (filters.area) params.area = filters.area;
  if (filters.fecha) params.fecha = filters.fecha;
  if (filters.horario) {
    switch(filters.horario) {
      case 'morning':
        params.hora_inicio__gte = '08:00:00';
        params.hora_inicio__lt = '12:00:00';
        break;
      case 'afternoon':
        params.hora_inicio__gte = '12:00:00';
        params.hora_inicio__lt = '18:00:00';
        break;
      case 'evening':
        params.hora_inicio__gte = '18:00:00';
        params.hora_inicio__lt = '22:00:00';
        break;
    }
  }
  
  console.log('Filtros enviados a la API:', params);
  return getAllCitasDisponibles(params);
};

// Obtener todas las áreas
export const getAllAreas = () => areasApi.get('/');

// Obtener todos los profesionales de salud
export const getAllProfesionales = () => profesionalesSaludApi.get('/');

// Obtener todos los consultorios
export const getAllConsultorios = () => consultoriosApi.get('/');