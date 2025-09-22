// Import Dependencies
import Chart from "react-apexcharts";
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

// Colores personalizados para los diagnósticos
const diagnosticoColors = {
  Lesión: '#FFA500',      // Naranja
  Evaluación: '#3498DB',  // Azul
  Tratamiento: '#2ECC71', // Verde
  Control: '#E74C3C'      // Rojo
};

const baseOptions = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    fontSize: "14px",
    markers: {
      radius: 12,
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " consultas";
      },
    },
  },
};

export function CitasPorAreaChart({ data }) {
  // Verificar y normalizar datos
  const monthlyDataByProfesional = data.monthly_data_by_profesional || [];
  const profesionalesData = data.profesionales_data || [];
  
  console.log("Datos completos recibidos:", JSON.stringify(data, null, 2));
  
  // Crear datos por defecto si no hay profesionales
  if (!profesionalesData || profesionalesData.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100 mb-4">
          Evolución Mensual de Consultas por Profesional
        </h3>
        <p className="text-center py-8 text-gray-500">
          No hay datos disponibles para mostrar
        </p>
      </div>
    );
  }

  // Función para generar colores únicos
  const generateColorForProfesional = (index, profesionalName) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
    ];
    
    if (index < colors.length) {
      return colors[index];
    }
    
    // Color basado en hash si se excede la paleta
    let hash = 0;
    for (let i = 0; i < profesionalName.length; i++) {
      hash = profesionalName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 60%)`;
  };

  // Preparar datos
  const categories = monthlyDataByProfesional.map(m => m.mes);
  
  // Crear mapa de profesionales activos (que tienen al menos una consulta)
  const profesionalesActivos = profesionalesData.filter(prof => {
    // Verificar si el profesional tiene consultas en algún mes
    return monthlyDataByProfesional.some(monthData => 
      monthData.profesionales && 
      monthData.profesionales.some(p => 
        String(p.profesional_id) === String(prof.id) && 
        (p.count || 0) > 0
      )
    );
  });

  console.log("Profesionales activos:", profesionalesActivos);

  // Crear series solo para profesionales activos
  const series = profesionalesActivos.map((profesional, index) => {
    const profesionalData = monthlyDataByProfesional.map(monthData => {
      if (!monthData.profesionales || !Array.isArray(monthData.profesionales)) {
        return 0;
      }
      
      const profesionalMatch = monthData.profesionales.find(p => 
        String(p.profesional_id) === String(profesional.id)
      );
      
      return profesionalMatch ? (profesionalMatch.count || 0) : 0;
    });
    
    console.log(`Datos para ${profesional.nombre}:`, profesionalData);
    
    return {
      name: profesional.nombre,
      data: profesionalData,
      color: generateColorForProfesional(index, profesional.nombre)
    };
  });

  console.log("Series finales generadas:", series);

  // Verificar si hay datos reales
  const hasRealData = series.some(serie => serie.data.some(val => val > 0));

  if (!hasRealData) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100 mb-4">
          Evolución Mensual de Consultas por Profesional
        </h3>
        <p className="text-center py-8 text-gray-500">
          No hay consultas registradas para ningún profesional en los últimos 12 meses
        </p>
      </div>
    );
  }

  const options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'bar',
      stacked: false,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 2,
        dataLabels: {
          position: 'top',
        },
      },
    },
    colors: series.map(s => s.color),
    xaxis: {
      categories,
      title: {
        text: 'Meses',
        style: {
          fontSize: '14px',
        },
      },
      labels: {
        style: {
          fontSize: '12px',
        },
        rotate: -45,
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
      title: {
        text: 'Número de consultas',
        style: {
          fontSize: '14px',
        },
      },
      min: 0,
      forceNiceScale: true,
      tickAmount: 5,
      labels: {
        formatter: (val) => Math.floor(val) === val ? val : '',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val > 0 ? val : '',
      offsetY: -20,
      style: {
        fontSize: '10px',
        colors: ['#000000']
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      markers: {
        radius: 6,
        width: 12,
        height: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    grid: {
      row: {
        colors: ['#f8f8f8', 'transparent'],
        opacity: 0.5,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val} consultas`,
      },
    },
    responsive: [{
      breakpoint: 600,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '50%',
          }
        },
        xaxis: {
          labels: {
            rotate: -45,
          }
        }
      }
    }]
  };
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100 mb-4">
        Evolución Mensual de Consultas por Profesional
      </h3>
      <Chart
        series={series}
        type="bar"
        height={400}
        options={options}
      />
    </div>
  );
}

export function EstadoDistribucionChart({ data }) {
  // Obtener datos de diagnósticos
  const diagnosticos = data.top_diagnosticos || [];
  
  if (diagnosticos.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100 mb-4">
          Distribución por Diagnóstico
        </h3>
        <p className="text-center py-8 text-gray-500">
          No hay datos disponibles para mostrar
        </p>
      </div>
    );
  }

  // Preparar datos para el gráfico
  const series = diagnosticos.map(d => d.total);
  const labels = diagnosticos.map(d => d.nombre);

  // Generar colores para cada diagnóstico
  const generateColorForDiagnostico = (index, name) => {
    if (diagnosticoColors[name]) {
      return diagnosticoColors[name];
    }
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
    if (index < colors.length) {
      return colors[index];
    }
    
    // Color basado en el índice o nombre si no está predefinido
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 60%)`;
  };

  const colors = diagnosticos.map((d, i) => generateColorForDiagnostico(i, d.nombre));

  const options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'donut',
    },
    labels: labels,
    colors: colors,
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, { seriesIndex, w }) {
        return w.config.labels[seriesIndex] + ': ' + Math.round(val) + '%';
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100 mb-4">
        Top Diagnósticos
      </h3>
      <Chart 
        series={series} 
        type="donut" 
        height={350} 
        options={options} 
      />
    </div>
  );
}

export function CitasMensualesChart({ data }) {
  const { primaryColorScheme } = useThemeContext();

  const monthlyData = data.monthly_data || [];

  if (monthlyData.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100 mb-4">
          Consultas Mensuales
        </h3>
        <p className="text-center py-8 text-gray-500">
          No hay datos disponibles para mostrar
        </p>
      </div>
    );
  }

  const series = [{
    name: 'Consultas',
    data: monthlyData.map(m => m.total)
  }];

  const options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'bar',
      toolbar: {
        show: true,
        tools: {
          download: true,
        }
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
        colors: {
          ranges: [{
            from: 0,
            to: 1000,
            color: primaryColorScheme === 'green' ? '#10B981' : '#3B82F6'
          }]
        }
      }
    },
    colors: [primaryColorScheme === 'green' ? '#10B981' : '#3B82F6'],
    xaxis: {
      categories: monthlyData.map(m => m.mes),
      title: {
        text: 'Mes'
      }
    },
    yaxis: {
      title: {
        text: 'Número de consultas'
      },
      min: 0,
      forceNiceScale: true,
      tickAmount: 5,
      labels: {
        formatter: (val) => Math.floor(val) === val ? val : '',
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val > 0 ? val : '',
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#000000']
      }
    },
    grid: {
      row: {
        colors: ['#f8f8f8', 'transparent'],
        opacity: 0.5
      }
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} consultas`
      }
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100 mb-4">
        Consultas Mensuales
      </h3>
      {series[0].data.some(val => val > 0) ? (
        <Chart 
          series={series} 
          type="bar" 
          height={350} 
          options={options} 
        />
      ) : (
        <p className="text-center py-8 text-gray-500">
          No hay datos disponibles para mostrar
        </p>
      )}
    </div>
  );
}