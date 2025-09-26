import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const metodologosApi = axios.create({
    baseURL:  `${API_BASE_URL}/Catalogos/metodologos/`
});

// API para grupos deportivos
const gruposApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/GruposDeportivos/`
});

// API para deportes
const deportesApi = axios.create({ 
    baseURL: `${API_BASE_URL}/Catalogos/Deportes/`
});

const usuariosApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Usuarios/`
});

// Operaciones CRUD para Metodólogos
export const getAllMetodologos = () => metodologosApi.get('/');
export const getMetodologoById = (id) => metodologosApi.get(`/${id}/`);
export const createMetodologo = (data) => metodologosApi.post('/', data);
export const updateMetodologo = (id, data) => metodologosApi.put(`/${id}/`, data);
export const deleteMetodologo = (id) => metodologosApi.delete(`/${id}/`);

// Operaciones para obtener las llaves foráneas
export const getAllGruposDeportivos = () => gruposApi.get('/');
export const getAllDeportes = () => deportesApi.get('/');
export const getAllUsuarios = () => usuariosApi.get('/');