import axios from "axios";

const baseURL = 'http://localhost:8000/';

const atletaApi = axios.create({
    baseURL: baseURL + 'Catalogos/Atletas/'
});

const categoriaApi = axios.create({
    baseURL: baseURL + 'Catalogos/Categorias/'
});

const deporteApi = axios.create({
    baseURL: baseURL + 'Catalogos/Deportes/'
});

// Operaciones básicas de atletas
export const getAtletaByUserId = (id) => atletaApi.get(`/?user=${id}`);
export const updateAtleta = (id, data) => atletaApi.patch(`/${id}/`, data);

// Para categorías y deportes
export const getAllCategorias = () => categoriaApi.get('/');
export const getAllDeportes = () => deporteApi.get('/');