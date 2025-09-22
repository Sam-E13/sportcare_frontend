import axios from "axios";

const deportesApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Deportes/'
});

// API para Grupos Deportivos
const grupoDeportivoApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/GruposDeportivos/'
});

// Operaciones CRUD para Deportes
export const getAllDeportes = () => deportesApi.get('/');
export const createDeporte = (deporte) => deportesApi.post('/', deporte);
export const getDeporteById = (id) => deportesApi.get(`/${id}/`);
export const updateDeporte = (id, deporte) => deportesApi.put(`/${id}/`, deporte);
export const deleteDeporte = (id) => deportesApi.delete(`/${id}/`);

// Operaciones para Grupos Deportivos
export const getAllGruposDeportivos = () => grupoDeportivoApi.get('/');