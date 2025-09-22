import axios from "axios";

const metodologosApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/metodologos/'
});

// API para grupos deportivos
const gruposApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/GruposDeportivos/' 
});

// API para deportes
const deportesApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Deportes/' 
});

const usuariosApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Usuarios/'
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