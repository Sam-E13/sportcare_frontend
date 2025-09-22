// Configuración de endpoints
const API_ENDPOINTS = {
  estadisticas: "http://localhost:8002/Consultas/api/estadisticas-consultas/",
  filtros: "http://localhost:8002/Consultas/api/filtros-consulta/",
  reporte: "http://localhost:8002/Consultas/generar-reporte-consultas/"
};

// Obtener estadísticas de consultas
export const fetchCitasStats = async () => {
  const response = await fetch(API_ENDPOINTS.estadisticas);
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  return await response.json();
}; 

// Obtener opciones de filtros para el reporte
export const fetchFiltrosOptions = async () => {
  const response = await fetch(API_ENDPOINTS.filtros);
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  return await response.json();
};

// Generar reporte PDF con filtros
export const generarReportePDF = async (filtros) => {
  const response = await fetch(API_ENDPOINTS.reporte, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filtros),
  });
  
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  
  return await response.blob();
};