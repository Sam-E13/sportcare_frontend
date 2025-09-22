// entrenadorList.api.js
import axios from "axios";

const entrenadorConta = axios.create({
    baseURL: 'http://localhost:8000/'  // ← Solo la base del servidor
});

const entrenadorApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Entrenadores/'
});

// Para usuarios
const userApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Usuarios/'
});

// Para deportes (disciplinas)
const deporteApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Deportes/'
});

// Operaciones CRUD para entrenadores
export const getAllEntrenadores = () => entrenadorApi.get('/');
export const getEntrenadorById = (id) => entrenadorApi.get(`/${id}/`);
export const createEntrenador = (entrenador) => entrenadorApi.post('/', entrenador);
export const updateEntrenador = (id, entrenador) => entrenadorApi.put(`/${id}/`, entrenador);
export const deleteEntrenador = (id) => entrenadorApi.delete(`/${id}/`);

// Obtener datos relacionados
export const getAllUsers = () => userApi.get('/');
export const getAllDeportes = () => deporteApi.get('/');

// Acceso a la ruta específica para detalles de entrenador
export const getEntrenadorDetalle = (entrenadorId) => 
    entrenadorConta.get(`Catalogos/Entrenador/${entrenadorId}/`);  
  
// Si se implementa una API para contacto de entrenador en el futuro
// export const getEntrenadorContacto = (entrenadorId) => 
//     entrenadorConta.get(`Catalogos/Entrenador/${entrenadorId}/contacto/`);
  
// export const saveEntrenadorContacto = (entrenadorId, contactoData) => {
//     return entrenadorConta.post(`Catalogos/Entrenador/${entrenadorId}/contacto/`, contactoData);
// };



  
  