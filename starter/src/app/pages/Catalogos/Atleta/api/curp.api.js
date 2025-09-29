import axios from "axios";

// Configuración para la API de Node.js
// Usa la variable de entorno o localhost por defecto

console.log('🔍 VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('🔍 Todas las variables:', import.meta.env);

const nodeApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 5000
});

console.log('🔍 baseURL final:', nodeApi.defaults.baseURL);

/**
 * Valida una CURP usando el servicio Node.js
 * @param {string} curp - La CURP a validar 
 * @returns {Promise<{valid: boolean, data: {sexo: string, fecha_nacimiento: string}|null}>}
 */
export const validateCurp = async (curp) => {
  try {
    const response = await nodeApi.post('/curp/validate', { curp });
    
    if (!response.data) {
      throw new Error('Respuesta vacía del servidor');
    }
    
    return {
      valid: response.data.valid,
      data: {
        sexo: response.data.sex === 'Hombre' ? 'H' : 'M',
        fecha_nacimiento: response.data.birthDate
      }
    };
  } catch (error) {
    console.error("Error al validar CURP con Node API:", error);
    return { valid: false, data: null };
  }
};