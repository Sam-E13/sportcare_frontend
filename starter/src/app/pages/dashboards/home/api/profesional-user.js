import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Obtener todos los profesionales de salud
const profesionalesApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Profesionales-Salud/`
});

// Obtener todas las citas
const citasApi = axios.create({
    baseURL: `${API_BASE_URL}/Modulos/Citas/`
});

const atletasApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Atletas/`
})

// Obtener un profesional por usuarioID
export const getProfesionalByUserId = (id) => profesionalesApi.get(`/?user=${id}`); 

//obtener Citas por profesionalId
export const getCitasByProfesionalId = (id) => citasApi.get(`/?profesional_salud=${id}`);

//confirmar cita
export const confirmarCita = (id) => citasApi.patch(`/${id}/`, { estado: 'Confirmada' });

//cancelar cita
export const cancelarCita = (id) => citasApi.patch(`/${id}/`, { estado: 'Cancelada' });


// Obtener cita por ID
export const getCitaById = (id) => citasApi.get(`/${id}/`);

//obtener datos de atleta por id
export const getAtletaById = (id) => atletasApi.get(`/${id}/`);