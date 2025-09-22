const API_BASE_URL = "http://localhost:8001/Citas/api/";

export const fetchCitasStats = async () => {
  const response = await fetch(`${API_BASE_URL}estadisticas-citas/`);
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  return await response.json();
};

export const fetchFiltrosOptions = async () => {
  const response = await fetch(`${API_BASE_URL}filtros-citas/`);
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  return await response.json();
};  