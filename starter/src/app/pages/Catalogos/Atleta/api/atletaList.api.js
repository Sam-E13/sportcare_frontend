// atletaList.api.js
import axios from "axios";

const atletaConta = axios.create({
    baseURL: 'http://localhost:8000/'  // ← Solo la base del servidor
});

const atletaApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Atletas/'
});

// Para usuarios
const userApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Usuarios/'
});

// Para categorías
const categoriaApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Categorias/'
});

// Para deportes
const deporteApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Deportes/'
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



  
  