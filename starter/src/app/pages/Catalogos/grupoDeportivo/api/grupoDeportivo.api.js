
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const grupoDeportivoApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/GruposDeportivos/`
});

// Operaciones CRUD para Grupos Deportivos
export const getAllGruposDeportivos = () => grupoDeportivoApi.get('/');
export const createGrupoDeportivo = (grupo) => grupoDeportivoApi.post('/', grupo);
export const getGrupoDeportivoById = (id) => grupoDeportivoApi.get(`/${id}/`);
export const updateGrupoDeportivo = (id, grupo) => grupoDeportivoApi.put(`/${id}/`, grupo);
export const deleteGrupoDeportivo = (id) => grupoDeportivoApi.delete(`/${id}/`); 