import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const consultorioApi = axios.create({
  baseURL: `${API_BASE_URL}/Catalogos/Consultorios/`
});

export const getAllConsultorios = async () => {
  const response = await consultorioApi.get('/');
  return response.data;
};

export const createConsultorio = async (consultorio) => {
  const response = await consultorioApi.post('/', consultorio);
  return response.data;
};

export const updateConsultorio = async (id, consultorio) => {
  try {
    const response = await consultorioApi.put(`/${id}/`, consultorio);
    return response.data;
  } catch (error) {
    console.error("Error updating consultorio:", error);
    throw error;
  }
};

export const deleteConsultorio = async (id) => {
  const response = await consultorioApi.delete(`/${id}/`);
  return response.data;
};