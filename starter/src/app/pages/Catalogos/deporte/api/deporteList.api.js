import axios from "axios";

// Usar la variable de entorno en lugar de localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const deportesApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Deportes/`
});

// API para Grupos Deportivos
const grupoDeportivoApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/GruposDeportivos/`
});

// Operaciones CRUD para Deportes
export const getAllDeportes = () => deportesApi.get('/');
export const createDeporte = (deporte) => deportesApi.post('/', deporte);
export const getDeporteById = (id) => deportesApi.get(`/${id}/`);
export const updateDeporte = (id, deporte) => deportesApi.put(`/${id}/`, deporte);
export const deleteDeporte = (id) => deportesApi.delete(`/${id}/`);

// Operaciones para Grupos Deportivos
export const getAllGruposDeportivos = () => grupoDeportivoApi.get('/');