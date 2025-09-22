import axios from 'axios';

// URLs base desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const CITAS_API_URL = import.meta.env.VITE_CITAS_API_URL || 'http://localhost:8001';

// Configuración de axios para el backend principal
export const atletaApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Atletas/`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const profesionalApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Profesionales-Salud/`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const citasApi = axios.create({
    baseURL: `${API_BASE_URL}/Modulos/Citas/`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const consultoriosApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Consultorios/`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const areasApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos/Areas/`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// API para el microservicio de citas (estadísticas y reportes)
export const citasStatsApi = axios.create({
    baseURL: `${CITAS_API_URL}/Citas/api/`,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptores para manejo de errores global
const setupInterceptors = (apiInstance, name) => {
    apiInstance.interceptors.request.use(
        (config) => {
            console.log(`${name} Request:`, config.url);
            return config;
        },
        (error) => {
            console.error(`${name} Request Error:`, error);
            return Promise.reject(error);
        }
    );

    apiInstance.interceptors.response.use(
        (response) => {
            console.log(`${name} Response:`, response.status);
            return response;
        },
        (error) => {
            console.error(`${name} Response Error:`, error.response?.status, error.message);
            
            // Manejo de errores comunes
            if (error.response?.status === 503) {
                console.warn(`${name}: Servicio temporalmente no disponible`);
            }
            
            return Promise.reject(error);
        }
    );
};

// Configurar interceptores para todas las APIs
setupInterceptors(atletaApi, 'Atletas API');
setupInterceptors(profesionalApi, 'Profesionales API');
setupInterceptors(citasApi, 'Citas API');
setupInterceptors(consultoriosApi, 'Consultorios API');
setupInterceptors(areasApi, 'Areas API');
setupInterceptors(citasStatsApi, 'Citas Stats API');

// Exportar URLs para uso directo si es necesario
export const API_URLS = {
    BASE: API_BASE_URL,
    CITAS_SERVICE: CITAS_API_URL,
    ATLETAS: `${API_BASE_URL}/Catalogos/Atletas/`,
    PROFESIONALES: `${API_BASE_URL}/Catalogos/Profesionales-Salud/`,
    CITAS: `${API_BASE_URL}/Modulos/Citas/`,
    CONSULTORIOS: `${API_BASE_URL}/Catalogos/Consultorios/`,
    AREAS: `${API_BASE_URL}/Catalogos/Areas/`,
    CITAS_STATS: `${CITAS_API_URL}/Citas/api/estadisticas-citas/`,
    CITAS_FILTROS: `${CITAS_API_URL}/Citas/api/filtros-citas/`,
    CITAS_REPORTES: `${CITAS_API_URL}/Citas/api/generar-reporte-pdf/`
};