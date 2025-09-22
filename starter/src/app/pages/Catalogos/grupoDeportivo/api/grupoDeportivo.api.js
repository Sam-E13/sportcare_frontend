
import axios from "axios";

const grupoDeportivoApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/GruposDeportivos/'
});

// Operaciones CRUD para Grupos Deportivos
export const getAllGruposDeportivos = () => grupoDeportivoApi.get('/');
export const createGrupoDeportivo = (grupo) => grupoDeportivoApi.post('/', grupo);
export const getGrupoDeportivoById = (id) => grupoDeportivoApi.get(`/${id}/`);
export const updateGrupoDeportivo = (id, grupo) => grupoDeportivoApi.put(`/${id}/`, grupo);
export const deleteGrupoDeportivo = (id) => grupoDeportivoApi.delete(`/${id}/`);