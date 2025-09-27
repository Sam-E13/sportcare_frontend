// Usar la variable de entorno para el microservicio de citas
const API_BASE_URL = import.meta.env.VITE_CITAS_API_URL || "http://localhost:8001";

// Log para debugging (quitar después)
console.log('API_BASE_URL para reportes:', API_BASE_URL);

export const fetchCitasStats = async () => {
  try {
    const url = `${API_BASE_URL}/Citas/api/estadisticas-citas/`;
    console.log('Llamando a:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.error('Response not ok:', response.status, response.statusText);
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Data recibida:', data);
    return data;
  } catch (error) {
    console.error('Error en fetchCitasStats:', error);
    throw error;
  }
};

export const fetchFiltrosOptions = async () => {
  try {
    const url = `${API_BASE_URL}/Citas/api/filtros-citas/`;
    console.log('Llamando a filtros:', url);
    
    const response = await fetch(url);
    console.log('Filtros response status:', response.status);
    
    if (!response.ok) {
      console.error('Filtros response not ok:', response.status, response.statusText);
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Filtros data:', data);
    return data;
  } catch (error) {
    console.error('Error en fetchFiltrosOptions:', error);
    throw error;
  }
};