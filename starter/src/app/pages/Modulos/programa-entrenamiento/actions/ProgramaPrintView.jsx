// ProgramaPrintView.jsx
import PropTypes from "prop-types";
import { 
  CalendarIcon, 
  UserIcon, 
  TrophyIcon,
  DocumentTextIcon,
  PlayIcon
} from "@heroicons/react/24/outline";
import { forwardRef } from "react";

const ProgramaPrintView = forwardRef(({ programas = [], isSelectedOnly = false }, ref) => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Add a check to ensure programas array exists and has items
  const hasData = Array.isArray(programas) && programas.length > 0;

  console.log('ProgramaPrintView renderizado con:', { programas, hasData, isSelectedOnly });

  return (
    <div className="print-container" ref={ref} style={{ width: '100%', minHeight: '100px' }}>
      <div className="flex flex-col px-5 py-12 bg-white sm:px-12">
        {/* Cabecera */}
        <div className="flex flex-col justify-between sm:flex-row">
          <div className="text-center sm:text-left">
            <div className="flex items-center">
              <TrophyIcon className="mr-2 size-6 text-primary-500" />
              <h2 className="text-2xl font-semibold uppercase text-primary-600 dark:text-primary-400">
                Listado de Programas de Entrenamiento
              </h2>
            </div>
            <div className="space-y-1 pt-2">
              <p>SportCareIdet</p>
              <p>Programas de Entrenamiento</p>
            </div>
          </div>
          <div className="mt-4 text-center sm:m-0 sm:text-right">
            <h2 className="text-xl font-semibold uppercase text-primary-600 dark:text-primary-400">
              Reporte
            </h2>
            <div className="space-y-1 pt-2">
              <p>
                Reporte #: <span className="font-semibold">{Math.floor(Math.random() * 10000)}</span>
              </p>
              <p>
                Fecha: <span className="font-semibold">{currentDate}</span>
              </p>
              <p>
                {isSelectedOnly ? 'Programas seleccionados' : 'Total de programas'}: <span className="font-semibold">{hasData ? programas.length : 0}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

        {/* Tabla de programas */}
        <div className="my-6">
          <h3 className="mb-4 text-lg font-medium">Listado completo de programas</h3>
          
          {hasData ? (
            <table className="w-full text-left rtl:text-right border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="bg-gray-200 font-semibold uppercase text-gray-800 border border-gray-300 px-4 py-2">
                    Programa
                  </th>
                  <th className="bg-gray-200 font-semibold uppercase text-gray-800 border border-gray-300 px-4 py-2">
                    Deporte
                  </th>
                  <th className="bg-gray-200 font-semibold uppercase text-gray-800 border border-gray-300 px-4 py-2">
                    Nivel
                  </th>
                  <th className="bg-gray-200 font-semibold uppercase text-gray-800 border border-gray-300 px-4 py-2">
                    Entrenador
                  </th>
                  <th className="bg-gray-200 font-semibold uppercase text-gray-800 border border-gray-300 px-4 py-2">
                    Duración
                  </th>
                  <th className="bg-gray-200 font-semibold uppercase text-gray-800 border border-gray-300 px-4 py-2">
                    Objetivo
                  </th>
                </tr>
              </thead>
              <tbody>
                {programas.map((programa, index) => (
                  <tr key={programa.id || index} className="border-b border-gray-200">
                    <td className="py-2 px-4 font-medium text-primary-600 border border-gray-300">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <PlayIcon className="mr-1 size-4" />
                          <span className="font-semibold">{programa.nombre || 'N/A'}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 max-w-xs truncate">
                          {programa.descripcion || 'Sin descripción'}
                        </p>
                      </div>
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <div className="flex items-center">
                        <TrophyIcon className="mr-1 size-4" />
                        {programa.deporte_nombre || 'N/A'}
                      </div>
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                        {programa.nivel || 'N/A'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <div className="flex items-center">
                        <UserIcon className="mr-1 size-4" />
                        {programa.entrenador_nombre || 'N/A'}
                      </div>
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 size-4" />
                        {programa.duracion_dias || 0} días
                      </div>
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <div className="flex items-center">
                        <DocumentTextIcon className="mr-1 size-4" />
                        <span className="max-w-xs truncate">
                          {programa.objetivo || 'N/A'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-gray-500 border border-gray-200 rounded">
              No hay programas disponibles para mostrar
            </div>
          )}
        </div>

        {/* Resumen de sesiones si hay datos */}
        {hasData && (
          <>
            <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>
            
            <div className="my-6">
              <h3 className="mb-4 text-lg font-medium">Resumen de sesiones por programa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programas.map((programa, index) => (
                  <div key={programa.id || index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-primary-600 mb-2">
                      {programa.nombre}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Sesiones:</span> {programa.sesiones?.length || 0}
                      </p>
                      <p>
                        <span className="font-medium">Total ejercicios:</span> {
                          programa.sesiones?.reduce((total, sesion) => 
                            total + (sesion.ejercicios?.length || 0), 0
                          ) || 0
                        }
                      </p>
                      <p>
                        <span className="font-medium">Nivel:</span> {programa.nivel || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

        {/* Pie del documento */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Este documento es un listado oficial de los programas de entrenamiento de SportCareIdet.</p>
          <p>© {new Date().getFullYear()} SportCareIdet</p>
        </div>
      </div>
    </div>
  );
});

ProgramaPrintView.propTypes = {
  programas: PropTypes.array,
  isSelectedOnly: PropTypes.bool
};

ProgramaPrintView.displayName = "ProgramaPrintView";

export { ProgramaPrintView };