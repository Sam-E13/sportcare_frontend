// Import Dependencies
import { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { Page } from "components/shared/Page";
import { Card, Button } from "components/ui";
import { CitasPorAreaChart, EstadoDistribucionChart, CitasMensualesChart } from "./CitasCharts";
import ReporteModal from "./ReporteModal.jsx";
import { fetchCitasStats, fetchFiltrosOptions } from "./citasApiService";

const ReportesCitas = () => {
  const [citasStats, setCitasStats] = useState({
    total: 0,
    completadas: 0,
    porcentaje: 0, 
    estado_distribucion: {
      Pendiente: 0,
      Confirmada: 0,
      Completada: 0,
      Cancelada: 0
    },
    areas_data: [],
    monthly_data: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filtrosOptions, setFiltrosOptions] = useState({
    atletas: [],
    areas: [],
    consultorios: [],
    profesionales: []
  });
  const [filtrosLoading, setFiltrosLoading] = useState(false);

  // Función para normalizar los datos del backend
  const normalizeStatsData = (data) => {
    console.log("Datos originales del backend:", data);

    const monthlyDataByArea = data.monthly_data_by_area || [];
    const normalizedMonthlyDataByArea = monthlyDataByArea.length > 0 
      ? monthlyDataByArea 
      : Array(12).fill().map((_, i) => {
          const month = new Date(0, i).toLocaleString('default', {month: 'short'});
          return {
            mes: month,
            mes_numero: i + 1,
            ano: new Date().getFullYear(),
            areas: [],
            total: 0
          };
        });
    
    const estado_distribucion = data.estado_distribucion || {};
    const normalizedEstadoDistribucion = {
      Pendiente: estado_distribucion.Pendiente || 0,
      Confirmada: estado_distribucion.Confirmada || 0,
      Completada: estado_distribucion.Completada || 0,
      Cancelada: estado_distribucion.Cancelada || 0
    };
    
    const areasData = data.areas_data || [];
    const normalizedAreasData = areasData.map(area => ({
      nombre: area.nombre || "",
      pendiente: area.pendiente || 0,
      confirmada: area.confirmada || 0,
      completada: area.completada || 0,
      cancelada: area.cancelada || 0
    }));
    
    const monthlyData = data.monthly_data || [];
    let normalizedMonthlyData = monthlyData;
    
    if (monthlyData.length === 0) {
      const months = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ];
      normalizedMonthlyData = months.map(mes => ({
        mes,
        total: 0
      }));
    }
    
    const normalized = {
      total: data.total_citas || 0,
      completadas: data.citas_completadas || 0,
      porcentaje: data.porcentaje_completadas || 0,
      estado_distribucion: normalizedEstadoDistribucion,
      areas_data: normalizedAreasData,
      monthly_data: normalizedMonthlyData,
      monthly_data_by_area: normalizedMonthlyDataByArea,
    };
    
    return normalized;
  };

  // Cargar estadísticas iniciales
  useEffect(() => {
    const loadCitasStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchCitasStats();
        const normalizedData = normalizeStatsData(data);
        setCitasStats(normalizedData);
      } catch (err) {
        console.error("Error fetching citas stats:", err);
        setError("No se pudieron cargar las estadísticas de citas");
      } finally {
        setLoading(false);
      }
    };

    loadCitasStats();
  }, []);

  // Cargar opciones de filtro cuando se muestra el modal
  useEffect(() => {
    const loadFiltrosOptions = async () => {
      if (showReportModal) {
        try {
          setFiltrosLoading(true);
          const data = await fetchFiltrosOptions();
          
          setFiltrosOptions({
            atletas: [{ id: "todos", nombre: "Todos los atletas" }, ...(data.atletas || [])],
            areas: [{ id: "todos", nombre: "Todas las áreas" }, ...(data.areas || [])],
            consultorios: [{ id: "todos", nombre: "Todos los consultorios" }, ...(data.consultorios || [])],
            profesionales: [{ id: "todos", nombre: "Todos los profesionales" }, ...(data['Profesionales-Salud'] || [])]
          });
        } catch (err) {
          console.error("Error fetching filtros options:", err);
          setError("No se pudieron cargar las opciones de filtrado");
        } finally {
          setFiltrosLoading(false);
        }
      }
    };

    loadFiltrosOptions();
  }, [showReportModal]);

  // Controlar el scroll cuando el modal está abierto
  useEffect(() => {
    if (showReportModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showReportModal]);

  return (
    <Page title="Reportes de Citas">
      <div className="transition-content px-[--margin-x] pb-8">
        {/* Encabezado con botón de reporte */}
        <div className="flex justify-between items-center py-5 lg:py-6">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            Reportes de Citas
          </h2>
          <Button 
            onClick={() => setShowReportModal(true)}
            color="primary"
            className="flex items-center gap-2"
          >
            <FaFilePdf className="size-4" />
            <span>Generar Reporte PDF</span>
          </Button>
        </div>

        {/* Sección de estadísticas */}
        <Card className="mb-6">
          <div className="p-4 sm:p-5">
            <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100 mb-4">
              Estadísticas del Mes
            </h3>
            
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                <p className="mt-2 text-sm text-gray-600 dark:text-dark-300">Cargando estadísticas...</p>
              </div>
            )}
            
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {error}
              </p>
            )}
            
            {!loading && !error && (
              <>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {citasStats.total}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-dark-300 mt-1">
                      Total de Citas
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {citasStats.completadas}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-dark-300 mt-1">
                      Citas Completadas
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {citasStats.porcentaje}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-dark-300 mt-1">
                      Porcentaje Completadas
                    </div>
                  </div>
                </div>
                
                {/* Sección de gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  <Card>
                    <div className="p-4">
                      <EstadoDistribucionChart data={citasStats} />
                    </div>
                  </Card>
                  
                  <Card>
                    <div className="p-4">
                      <CitasMensualesChart data={citasStats} />
                    </div>
                  </Card>
                  
                  <Card className="lg:col-span-2">
                    <div className="p-4">
                      <CitasPorAreaChart data={citasStats} />
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Modal para el Reporte PDF */}
        <ReporteModal 
          showModal={showReportModal}
          setShowModal={setShowReportModal}
          filtrosOptions={filtrosOptions}
          filtrosLoading={filtrosLoading}
        />
      </div>
    </Page>
  );
};

export default ReportesCitas;