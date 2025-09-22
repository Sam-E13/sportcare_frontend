// deporteList.api.js -> rename to horarioList.api.js
import axios from "axios";

const horariosApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Horarios/'
});

// Obtener todos los profesionales de salud
const profesionalesApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Profesionales-Salud/'
});

// Obtener todos los consultorios
const consultoriosApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Consultorios/'
});

export const getAllConsultorios = () => consultoriosApi.get('/');


export const getAllProfesionales = () => profesionalesApi.get('/');

// Obtener todos los horarios
export const getAllHorarios = () => horariosApi.get('/');

// Crear nuevo horario
export const createHorario = (horario) => horariosApi.post('/', horario);

// Obtener un horario por ID
export const getHorarioById = (id) => horariosApi.get(`/${id}/`);

// Actualizar un horario
export const updateHorario = (id, horario) => horariosApi.put(`/${id}/`, horario);

// Eliminar un horario
export const deleteHorario = (id) => horariosApi.delete(`/${id}/`);