// NotificacionesApi.js
import axios from "axios";

// Crear instancia base de axios
const notificacionesApi = axios.create({
  baseURL: 'http://localhost:8000/Notificaciones/Notificaciones/'
});

// Obtener notificaciones por usuarioId
export const getNotificacionesByUserId = (userId) => notificacionesApi.get(`/?user=${userId}`);

// Marcar notificación como leída
export const markAsRead = (id) => notificacionesApi.patch(`/${id}/`, { leida: true });

// Eliminar notificación
export const deleteNotification = (id) => notificacionesApi.delete(`/${id}/`);