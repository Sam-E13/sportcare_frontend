// disponibilidadTemporal.api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const disponibilidadApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Disponibilidad-Temporal/`
});

// Obtener todos los profesionales de salud
const profesionalesApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Profesionales-Salud/`
});

// Obtener todos los consultorios
const consultoriosApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Consultorios/`
});

export const getAllConsultorios = () => consultoriosApi.get('/');

export const getAllProfesionales = () => profesionalesApi.get('/');

// Obtener todas las disponibilidades temporales
export const getAllDisponibilidades = () => disponibilidadApi.get('/');

// Crear nueva disponibilidad temporal
export const createDisponibilidad = (disponibilidad) => disponibilidadApi.post('/', disponibilidad);

// Obtener una disponibilidad por ID
export const getDisponibilidadById = (id) => disponibilidadApi.get(`/${id}/`);

// Actualizar una disponibilidad
export const updateDisponibilidad = (id, disponibilidad) => disponibilidadApi.put(`/${id}/`, disponibilidad);

// Eliminar una disponibilidad
export const deleteDisponibilidad = (id) => disponibilidadApi.delete(`/${id}/`);