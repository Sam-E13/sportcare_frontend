import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Instancias de axios sin autenticación
const atletaApi = axios.create({
  baseURL: `${API_BASE_URL}/Catalogos/Atletas/`
}); 

const responsableApi = axios.create({
  baseURL: `${API_BASE_URL}/Catalogos/api/responsables/atleta/`
});

/**
 * Obtiene la información de un atleta y sus responsables
 * @param {string} atletaId - ID del atleta
 * @returns {Promise<{atletaInfo: object, responsables: array}>}
 */
export const fetchAtletaData = async (atletaId) => {
  try {
    if (!atletaId) throw new Error("ID de atleta no proporcionado");

    const [atletaResponse, responsablesResponse] = await Promise.all([
      atletaApi.get(`${atletaId}/`),
      responsableApi.get(`${atletaId}/`)
    ]);

    return {
      atletaInfo: atletaResponse.data,
      responsables: responsablesResponse.data
    };
  } catch (err) {
    console.error("Error en fetchAtletaData:", {
      status: err.response?.status,
      data: err.response?.data,
      url: err.config?.url
    });

    throw err;
  }
};

/**
 * Elimina un responsable
 * @param {string} responsableId - ID del responsable a eliminar
 * @returns {Promise<void>}
 */
export const deleteResponsable = async (responsableId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/Catalogos/api/responsables/${responsableId}/`
    );
    toast.success("Responsable eliminado correctamente");
    return response.data;
  } catch (err) {
    console.error("Error en deleteResponsable:", {
      url: err.config?.url,
      status: err.response?.status,
      data: err.response?.data
    });
    toast.error(err.response?.data?.message || "Error al eliminar el responsable");
    throw err;
  }
};

/**
 * Actualiza los datos de un responsable
 * @param {string} responsableId - ID del responsable
 * @param {object} data - Datos a actualizar
 * @returns {Promise<object>} - Datos actualizados
 */
export const updateResponsable = async (responsableId, data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Catalogos/api/responsables/${responsableId}/update/`,
      data,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error en updateResponsable:", {
      url: err.config?.url,
      method: err.config?.method,
      status: err.response?.status,
      data: err.response?.data
    });
    throw err;
  }
};

/**
 * Crea un nuevo responsable para un atleta
 * @param {string} atletaId - ID del atleta
 * @param {object} data - Datos del nuevo responsable
 * @returns {Promise<object>}
 */
export const createResponsable = async (atletaId, data) => {
  const url = `${API_BASE_URL}/Catalogos/api/responsables/atleta/${atletaId}/create/`;

  try {
    const response = await axios.post(
      url,
      data,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  } catch (err) {
    console.error('Error en createResponsable:', {
      config: err.config,
      response: err.response,
      message: err.message
    });

    const errorMessage = err.response?.data?.detail ||
                         err.response?.data?.message ||
                         err.message ||
                         "Error al crear el responsable";

    throw new Error(errorMessage);
  }
};
