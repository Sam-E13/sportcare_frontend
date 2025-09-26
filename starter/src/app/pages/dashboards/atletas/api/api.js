// api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const citasApi = axios.create({
    baseURL: `${API_BASE_URL}/Modulos/Citas/`,
});  

const atletasApi = axios.create({
    baseURL: `${API_BASE_URL}Catalogos/Atletas/`
});

// Nueva instancia para el catálogo de slots disponibles
const catalogosApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/`
});

// Obtener atleta por userID
export const getAtletaByUserId = (id) => atletasApi.get(`/?user=${id}`);

// Obtener citas por atletaID
export const getCitasByAtletaId = (id) => citasApi.get(`/?atleta=${id}`);

// Obtener cita por id
export const getCitaById = (id) => citasApi.get(`/${id}`);

// Crear nueva cita
export const createCita = (citaData) => citasApi.post('/', citaData);

// Actualizar cita existente
export const updateCita = (id, citaData) => citasApi.put(`/${id}/`, citaData);

// Eliminar cita
export const deleteCita = (id) => citasApi.delete(`/${id}/`);

// Confirmar cita
export const confirmarCita = (id) => citasApi.patch(`/${id}/confirmar/`);

// Cancelar cita
export const cancelarCita = (id) => citasApi.patch(`/${id}/cancelar/`);

// Completar cita
export const completarCita = (id) => citasApi.patch(`/${id}/completar/`);

// ===== NUEVAS FUNCIONES PARA REAGENDAR CITAS =====

// Obtener slots disponibles con filtros
export const getSlotsDisponibles = (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Agregar parámetros de filtro si existen
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
            queryParams.append(key, params[key]);
        }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `Citas-Disponibles/?${queryString}` : 'Citas-Disponibles/';
    
    return catalogosApi.get(url);
};

// Obtener slots disponibles para un profesional específico en un rango de fechas
export const getSlotsDisponiblesPorProfesional = (profesionalId, fechaInicio, fechaFin) => {
    return getSlotsDisponibles({
        profesional_salud: profesionalId,
        disponible: true,
        fecha__gte: fechaInicio,
        fecha__lte: fechaFin
    });
};

// Obtener horarios de un profesional de salud
export const getHorariosProfesional = (profesionalId) => {
    return catalogosApi.get(`Horarios/?profesional_salud=${profesionalId}`);
};

// Obtener disponibilidad temporal de un profesional
export const getDisponibilidadTemporal = (profesionalId, fechaInicio, fechaFin) => {
    const params = new URLSearchParams({
        profesional_salud: profesionalId,
        activo: true
    });
    
    if (fechaInicio) params.append('fecha_inicio__lte', fechaInicio);
    if (fechaFin) params.append('fecha_fin__gte', fechaFin);
    
    return catalogosApi.get(`Disponibilidad-Temporal/?${params.toString()}`);
};

// Obtener slots disponibles para reagendar (con filtros específicos)
export const getSlotsDisponiblesParaReagendar = (profesionalId, fechaInicio, fechaFin) => {
    const params = new URLSearchParams({
        profesional_salud: profesionalId,
        fecha__gte: fechaInicio,
        fecha__lte: fechaFin,
        disponible: true  // Solo slots disponibles
    });
    
    return catalogosApi.get(`Citas-Disponibles/?${params.toString()}`);
};