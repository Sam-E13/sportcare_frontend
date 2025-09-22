// Import Dependencies
import Chart from "react-apexcharts";
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

// Colores personalizados para los estados (movido al inicio del archivo)
const estadoColors = {
  Pendiente: '#FFA500',    // Naranja
  Confirmada: '#3498DB',   // Azul
  Completada: '#2ECC71',   // Verde
  Cancelada: '#E74C3C'     // Rojo
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
        return val + " citas";
      },
    },
  },
};

export function CitasPorAreaChart({ data }) {
  // Verificar y normalizar datos
  const monthlyDataByArea = data.monthly_data_by_area || [];
  const areasData = data.areas_data || [];
  
  // Crear datos por defecto si no hay áreas
  if (areasData.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100 mb-4">
          Evolución Mensual de Citas por Área
        </h3>
        <p className="text-center py-8 text-gray-500">
          No hay datos disponibles para mostrar
        </p>
      </div>
    );
  }

  // Función para generar colores únicos
  const generateColorForArea = (areaName) => {
    let hash = 0;
    for (let i = 0; i < areaName.length; i++) {
      hash = areaName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 60%)`;
  };

  // Preparar datos
  const categories = monthlyDataByArea.map(m => m.mes);
  const areasMap = {};
  areasData.forEach(area => {
    areasMap[area.nombre] = {
      id: area.id,
      color: generateColorForArea(area.nombre)
    };
  });

  // Crear series por área
  const series = Object.keys(areasMap).map(areaName => {
    const areaData = monthlyDataByArea.map(monthData => {
      // Buscar el área por nombre en lugar de por ID
      const areaInMonth = monthData.areas.find(a => 
        a.area_name === areaName || 
        a.nombre === areaName
      );
      return areaInMonth ? areaInMonth.count : 0;
    });
    
    return {
      name: areaName,
      data: areaData,
      color: areasMap[areaName].color
    };
  });

  const options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'bar',
      stacked: false, // Barras agrupadas, no apiladas
      toolbar: {
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
        horizontal: false, // Barras verticales
        columnWidth: '70%', // Ancho de las barras
        borderRadius: 4, // Esquinas redondeadas
        dataLabels: {
          position: 'top', // Posición de las etiquetas
        },
      },
    },
    colors: series.map(s => s.color), // Colores personalizados por área
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
        rotate: -45, // Rotar etiquetas para mejor legibilidad
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
        text: 'Número de citas',
        style: {
          fontSize: '14px',
        },
      },
      min: 0,
      forceNiceScale: true,
      tickAmount: 5,
      labels: {
        formatter: (val) => Math.floor(val) === val ? val : '', // Mostrar solo valores enteros
      },
    },
    dataLabels: {
      enabled: false, // Deshabilitar etiquetas en barras por defecto
      formatter: (val) => val > 0 ? val : '', // Mostrar solo valores positivos
      offsetY: -20, // Posición de las etiquetas
      style: {
        fontSize: '12px',
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
        colors: ['#f8f8f8', 'transparent'], // Líneas de grid alternadas
        opacity: 0.5,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val} citas`,
      },
    },
    responsive: [{
      breakpoint: 600,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '50%', // Barras más anchas en móviles
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

  // Verificar si hay datos
  const hasData = series.length > 0;

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100 mb-4">
        Evolución Mensual de Citas por Área
      </h3>
      {hasData ? (
        <Chart 
          series={series} 
          type="bar" 
          height={400 + (categories.length * 5)} // Altura dinámica
          options={options} 
        />
      ) : (
        <p className="text-center py-8 text-gray-500">
          No hay citas registradas en ninguna área
        </p>
      )}
    </div>
  );
}

export function EstadoDistribucionChart({ data }) {
  // Definir todos los estados posibles
  const estados = ['Pendiente', 'Confirmada', 'Completada', 'Cancelada'];
  
  // Verificar si hay datos y mostrar información de depuración
  console.log("Estado distribución datos:", data.estado_distribucion);
  
  // Preparar series asegurando que todos los estados estén presentes
  const series = estados.map(estado => {
    // Buscar el valor en estado_distribucion, si no existe devolver 0
    const value = data.estado_distribucion?.[estado] || 0;
    console.log(`Estado: ${estado}, Valor: ${value}`);
    return value;
  });

  // Filtrar para no mostrar estados con valor 0
  const filteredLabels = [];
  const filteredSeries = [];
  const filteredColors = [];
  
  estados.forEach((estado, index) => {
    if (series[index] > 0) {
      filteredLabels.push(estado);
      filteredSeries.push(series[index]);
      filteredColors.push(estadoColors[estado]);
    }
  });

  const options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'donut',
    },
    colors: filteredColors.length > 0 ? filteredColors : estados.map(estado => estadoColors[estado]),
    labels: filteredLabels.length > 0 ? filteredLabels : estados,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
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
        Distribución por Estado
      </h3>
      {series.some(val => val > 0) ? (
        <Chart 
          series={filteredSeries.length > 0 ? filteredSeries : series} 
          type="donut" 
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

export function CitasMensualesChart({ data }) {
  const { primaryColorScheme } = useThemeContext();

  // Verificar si hay datos mensuales
  console.log("Datos mensuales:", data.monthly_data);

  const monthlyData = data.monthly_data || Array(12).fill(0).map((_, i) => ({
    mes: new Date(0, i).toLocaleString('default', {month: 'short'}),
    total: 0
  }));

  const series = [{
    name: 'Citas',
    data: monthlyData.map(m => m.total)
  }];

  const options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'bar',
    },
    colors: [primaryColorScheme?.[500] || '#4F46E5'], // Color por defecto si no existe el contexto de tema
    xaxis: {
      categories: monthlyData.map(m => m.mes),
      title: {
        text: 'Mes'
      }
    },
    yaxis: {
      title: {
        text: 'Número de citas'
      },
      min: 0,
      forceNiceScale: true
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      }
    },
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100 mb-4">
        Citas Mensuales
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