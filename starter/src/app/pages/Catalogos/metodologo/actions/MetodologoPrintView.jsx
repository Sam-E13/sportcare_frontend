import PropTypes from "prop-types";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { forwardRef } from "react";
import { Table, THead, TBody, Th, Tr, Td } from "components/ui";

export const MetodologoPrintView = forwardRef(({ metodologos, isSelectedOnly = false }, ref) => {
  const currentDate = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
 
  // Verificar si hay datos
  const hasData = Array.isArray(metodologos) && metodologos.length > 0;

  // TEMPORAL: Para ver la estructura de datos
  if (hasData) {
    console.log("Estructura de metodólogo:", metodologos[0]);
  }

  return (
    <div className="print-container" ref={ref}>
      <div className="flex flex-col px-5 py-12 bg-white sm:px-12">
        {/* Cabecera */}
        <div className="flex flex-col justify-between sm:flex-row">
          <div className="text-center sm:text-left">
            <div className="flex items-center">
              <UserGroupIcon className="mr-2 size-6 text-primary-500" />
              <h2 className="text-2xl font-semibold uppercase text-primary-600 dark:text-primary-400">
                Listado de Metodólogos
              </h2>
            </div>
            <div className="space-y-1 pt-2">
              <p>SportCareIdet</p>
              <p>Catálogo de Metodólogos</p>
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
                {isSelectedOnly ? 'Metodólogos seleccionados' : 'Total de metodólogos'}: <span className="font-semibold">{hasData ? metodologos.length : 0}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

        {/* Tabla de metodólogos con las columnas correctas */}
        <div className="my-6">
          <h3 className="mb-4 text-lg font-medium">
            {isSelectedOnly ? 'Metodólogos seleccionados' : 'Listado completo de metodólogos'}
          </h3>
          
          {hasData ? (
            <Table className="w-full text-left rtl:text-right">
              <THead>
                <Tr>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Nombre
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Apellido Paterno
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Apellido Materno
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Grupos
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Deportes
                  </Th>
                </Tr>
              </THead>
              <TBody>
                {metodologos.map((metodologo, index) => (
                  <Tr 
                    key={metodologo.id || index} 
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <Td className="py-2 font-medium text-primary-600">
                      {metodologo.nombre || 'Sin nombre'}
                    </Td>
                    <Td className="py-2 text-gray-700">
                      {metodologo.aPaterno || 'Sin apellido paterno'}
                    </Td>
                    <Td className="py-2 text-gray-700">
                      {metodologo.aMaterno || 'Sin apellido materno'}
                    </Td>
                    <Td className="py-2 text-gray-700">
                      {/* Mostrar grupos */}
                      {(() => {
                        // Primero intentamos con campos display
                        if (metodologo.grupos_display) return metodologo.grupos_display;
                        if (metodologo.grupo_display) return metodologo.grupo_display;
                        
                        // Si grupos es un array de objetos
                        if (Array.isArray(metodologo.grupos)) {
                          return metodologo.grupos.map(grupo => {
                            if (typeof grupo === 'object' && grupo.nombre) return grupo.nombre;
                            if (typeof grupo === 'string') return grupo;
                            return `Grupo ${grupo}`;
                          }).join(', ');
                        }
                        
                        // Si grupo es un objeto individual
                        if (metodologo.grupo && typeof metodologo.grupo === 'object') {
                          return metodologo.grupo.nombre || `Grupo ${metodologo.grupo.id}`;
                        }
                        
                        // Si solo tenemos un ID o string
                        if (metodologo.grupos) return `Grupo ${metodologo.grupos}`;
                        if (metodologo.grupo) return `Grupo ${metodologo.grupo}`;
                        
                        return 'Sin grupos';
                      })()}
                    </Td>
                    <Td className="py-2 text-gray-700">
                      {/* Mostrar deportes */}
                      {(() => {
                        // Primero intentamos con campos display
                        if (metodologo.deportes_display) return metodologo.deportes_display;
                        if (metodologo.deporte_display) return metodologo.deporte_display;
                        
                        // Si deportes es un array de objetos
                        if (Array.isArray(metodologo.deportes)) {
                          return metodologo.deportes.map(deporte => {
                            if (typeof deporte === 'object' && deporte.nombre) return deporte.nombre;
                            if (typeof deporte === 'string') return deporte;
                            return `Deporte ${deporte}`;
                          }).join(', ');
                        }
                        
                        // Si deporte es un objeto individual
                        if (metodologo.deporte && typeof metodologo.deporte === 'object') {
                          return metodologo.deporte.nombre || `Deporte ${metodologo.deporte.id}`;
                        }
                        
                        // Si solo tenemos un ID o string
                        if (metodologo.deportes) return `Deporte ${metodologo.deportes}`;
                        if (metodologo.deporte) return `Deporte ${metodologo.deporte}`;
                        
                        return 'Sin deportes';
                      })()}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          ) : (
            <div className="p-4 text-center text-gray-500 border border-gray-200 rounded">
              No hay metodólogos disponibles para mostrar
            </div>
          )}
        </div>

        <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

        {/* Pie del documento */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Este documento es un listado oficial del catálogo de metodólogos de SportCareIdet.</p>
          <p>Generado el {currentDate} - © {new Date().getFullYear()} SportCareIdet</p>
        </div>
      </div>
    </div>
  );
});

MetodologoPrintView.propTypes = {
  metodologos: PropTypes.array.isRequired,
  isSelectedOnly: PropTypes.bool
};

MetodologoPrintView.defaultProps = {
  isSelectedOnly: false
};

MetodologoPrintView.displayName = "MetodologoPrintView";