// Import Dependencies
import { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { Page } from "components/shared/Page";
import { Card, Button } from "components/ui";
import { CitasPorAreaChart, EstadoDistribucionChart, CitasMensualesChart } from "./CitasCharts";
import ReporteModal from "./ReporteModal.jsx";
import { fetchCitasStats, fetchFiltrosOptions } from "./citasApiService";

const ReportesConsultas = () => {
  const [citasStats, setCitasStats] = useState({
    total_consultas: 0,
    consultas_mes_actual: 0,
    profesionales_data: [],
    monthly_data_by_profesional: [],
    monthly_data: [],
    top_atletas: [],
    top_diagnosticos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filtrosOptions, setFiltrosOptions] = useState({
    atletas: [],
    profesionales: []
  });
  const [filtrosLoading, setFiltrosLoading] = useState(false);

  // Cargar estadísticas iniciales
  useEffect(() => {
    const loadCitasStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchCitasStats();
        console.log("Datos recibidos del backend:", data);
        setCitasStats(data);
      } catch (err) {
        console.error("Error al cargar estadísticas de consultas:", err);
        setError("No se pudieron cargar las estadísticas de consultas");
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
            profesionales: [{ id: "todos", nombre: "Todos los profesionales" }, ...(data.profesionales || [])]
          });
        } catch (err) {
          console.error("Error al cargar opciones de filtrado:", err);
          // Usar datos de ejemplo si hay error
          setFiltrosOptions({
            atletas: [{ id: "todos", nombre: "Todos los atletas" }],
            profesionales: [{ id: "todos", nombre: "Todos los profesionales" }]
          });
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

  if (loading) {
    return (
      <Page title="Reportes y Consultas">
        <div className="transition-content w-full px-[--margin-x] pb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-100">Reportes y Consultas</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-200 dark:bg-dark-700 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Reportes y Consultas">
        <div className="transition-content w-full px-[--margin-x] pb-8 pt-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-100">Reportes y Consultas</h1>
          </div>
          <Card className="p-6 text-center">
            <p className="text-error text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </Card>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Reportes y Consultas">
      <div className="transition-content w-full px-[--margin-x] pb-8 pt-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-100">Reportes y Consultas</h1>
          <Button 
            color="primary"
            className="flex items-center gap-2"
            onClick={() => setShowReportModal(true)}
          >
            <FaFilePdf />
            <span>Generar Reporte</span>
          </Button>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="text-sm text-gray-500 dark:text-dark-300">Total Consultas</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-dark-100">{citasStats.total_consultas || 0}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm text-gray-500 dark:text-dark-300">Consultas Mes Actual</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-dark-100">{citasStats.consultas_mes_actual || 0}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm text-gray-500 dark:text-dark-300">Profesionales Activos</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-dark-100">{citasStats.profesionales_data?.length || 0}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm text-gray-500 dark:text-dark-300">Diagnósticos Comunes</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-dark-100">{citasStats.top_diagnosticos?.length || 0}</p>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-4">
            <CitasMensualesChart data={citasStats} />
          </Card>
          <Card className="p-4">
            <CitasPorAreaChart data={citasStats} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <EstadoDistribucionChart data={{top_diagnosticos: citasStats.top_diagnosticos}} />
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100 mb-4">
              Top Atletas con más Consultas
            </h3>
            <div className="overflow-auto max-h-80">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-500">
                <thead className="bg-gray-50 dark:bg-dark-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300 uppercase tracking-wider">
                      Atleta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300 uppercase tracking-wider">
                      Total Consultas
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-700 divide-y divide-gray-200 dark:divide-dark-500">
                  {citasStats.top_atletas && citasStats.top_atletas.length > 0 ? (
                    citasStats.top_atletas.map((atleta, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-dark-100">
                          {atleta.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-dark-100">
                          {atleta.total}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-dark-300">
                        No hay datos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal para generar reportes */}
      <ReporteModal
        showModal={showReportModal}
        setShowModal={setShowReportModal}
        filtrosOptions={filtrosOptions}
        filtrosLoading={filtrosLoading}
      />
    </Page>
  );
};

export default ReportesConsultas;