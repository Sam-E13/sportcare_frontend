import axios from "axios";

// Usar la variable de entorno en lugar de localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Log para debugging (puedes quitarlo después)
console.log('API_BASE_URL para deportes:', API_BASE_URL);

const deportesApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Deportes/`
});

// API para Grupos Deportivos
const grupoDeportivoApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/GruposDeportivos/`
});

// Operaciones CRUD para Deportes con mejor manejo de errores
export const getAllDeportes = async () => {
    try {
        console.log('Llamando a:', `${API_BASE_URL}/Catalogos/Deportes/`);
        const response = await deportesApi.get('/');
        console.log('Respuesta getAllDeportes:', response);
        return response;
    } catch (error) {
        console.error('Error en getAllDeportes:', error);
        console.error('Error response:', error.response?.data);
        console.error('Status:', error.response?.status);
        throw error;
    }
};

export const createDeporte = async (deporte) => {
    try {
        console.log('Creando deporte:', deporte);
        const response = await deportesApi.post('/', deporte);
        console.log('Deporte creado:', response);
        return response;
    } catch (error) {
        console.error('Error en createDeporte:', error);
        throw error;
    }
};

export const getDeporteById = async (id) => {
    try {
        const response = await deportesApi.get(`/${id}/`);
        return response;
    } catch (error) {
        console.error('Error en getDeporteById:', error);
        throw error;
    }
};

export const updateDeporte = async (id, deporte) => {
    try {
        const response = await deportesApi.put(`/${id}/`, deporte);
        return response;
    } catch (error) {
        console.error('Error en updateDeporte:', error);
        throw error;
    }
};

export const deleteDeporte = async (id) => {
    try {
        const response = await deportesApi.delete(`/${id}/`);
        return response;
    } catch (error) {
        console.error('Error en deleteDeporte:', error);
        throw error;
    }
};

// Operaciones para Grupos Deportivos
export const getAllGruposDeportivos = async () => {
    try {
        console.log('Llamando a:', `${API_BASE_URL}/Catalogos/GruposDeportivos/`);
        const response = await grupoDeportivoApi.get('/');
        console.log('Respuesta getAllGruposDeportivos:', response);
        return response;
    } catch (error) {
        console.error('Error en getAllGruposDeportivos:', error);
        throw error;
    }
};