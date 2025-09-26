// atletaList.api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const atletaApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Atletas/`
});

// Para usuarios
const userApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Usuarios/`
});

// Para categorías
const categoriaApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Categorias/`
});

// Para deportes
const deporteApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Deportes/`
});

export const getAllAtletas = () => atletaApi.get('/');
export const getAtletaById = (id) => atletaApi.get(`/${id}/`);
export const createAtleta = (atleta) => atletaApi.post('/', atleta);
export const updateAtleta = (id, atleta) => atletaApi.put(`/${id}/`, atleta);
export const deleteAtleta = (id) => atletaApi.delete(`/${id}/`);

// Obtener datos relacionados
export const getAllUsers = () => userApi.get('/');
export const getAllCategorias = () => categoriaApi.get('/');
export const getAllDeportes = () => deporteApi.get('/');

export const getAtletaContacto = (atletaId) => 
    atletaConta.get(`Catalogos/Atleta/${atletaId}/contacto/`);  // ← URL completa pero sin duplicar
  
  export const saveAtletaContacto = (atletaId, contactoData) => {
    return atletaConta.post(`Catalogos/Atleta/${atletaId}/contacto/`, contactoData);
  };



  
  