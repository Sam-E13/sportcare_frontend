// src/api/curp.api.js
import axios from "axios";

// Configuración para la API de Node.js
const nodeApi = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000
});

/**
 * Valida una CURP usando el servicio Node.js
 * @param {string} curp - La CURP a validar (18 caracteres)
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