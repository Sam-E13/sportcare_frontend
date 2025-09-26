// Usar la variable de entorno para el microservicio de citas
const API_BASE_URL = import.meta.env.VITE_CITAS_API_URL || "http://localhost:8001";

export const fetchCitasStats = async () => {
  const response = await fetch(`${API_BASE_URL}/Citas/api/estadisticas-citas/`);
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  return await response.json();
};

export const fetchFiltrosOptions = async () => {
  const response = await fetch(`${API_BASE_URL}/Citas/api/filtros-citas/`);
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  return await response.json();
};