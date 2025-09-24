import axios from "axios";

// Verificar que la variable de entorno se esté cargando correctamente
console.log('Environment VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    console.error('❌ VITE_API_BASE_URL no está definida');
}

const deportesApi = axios.create({
    baseURL: `${API_BASE_URL}/Catalogos`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getAllDeportes = async () => {
    try {
        const url = '/Deportes/';
        console.log('🔗 Making request to:', API_BASE_URL + url);
        
        const response = await deportesApi.get(url);
        console.log('✅ Response received:', response.status);
        return response;
        
    } catch (error) {
        console.error('❌ Error en getAllDeportes:');
        console.error('URL:', error.config?.url);
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
        throw error;
    }
};