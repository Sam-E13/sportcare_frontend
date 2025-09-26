import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const atletaApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Atletas/`
});

const categoriaApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Categorias/`
});

const deporteApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Deportes/`
});

// Operaciones básicas de atletas
export const getAtletaByUserId = (id) => atletaApi.get(`/?user=${id}`);
export const updateAtleta = (id, data) => atletaApi.patch(`/${id}/`, data);

// Para categorías y deportes
export const getAllCategorias = () => categoriaApi.get('/');
export const getAllDeportes = () => deporteApi.get('/');