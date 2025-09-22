// DisponibilidadTemporalPrintView.jsx
import PropTypes from "prop-types";
import { CalendarIcon, ClockIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { forwardRef } from "react";
import { Table, THead, TBody, Th, Tr, Td } from "components/ui";

export const DisponibilidadTemporalPrintView = forwardRef(({ disponibilidades, isSelectedOnly = false }, ref) => {
  const currentDate = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Días de la semana para mostrar correctamente el día
  const diasSemana = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo'
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Función para formatear días de la semana
  const formatDiasSemana = (dias) => {
    if (!dias || !Array.isArray(dias)) return 'N/A';
    return dias.map(dia => diasSemana[dia] || `Día ${dia}`).join(', ');
  };

  // Add a check to ensure disponibilidades array exists and has items
  const hasData = Array.isArray(disponibilidades) && disponibilidades.length > 0;

  return (
    <div className="print-container" ref={ref}>
      <div className="flex flex-col px-5 py-12 bg-white sm:px-12">
        {/* Cabecera */}
        <div className="flex flex-col justify-between sm:flex-row">
          <div className="text-center sm:text-left">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 size-6 text-primary-500" />
              <h2 className="text-2xl font-semibold uppercase text-primary-600 dark:text-primary-400">
                Listado de Horarios Temporales
              </h2>
            </div>
            <div className="space-y-1 pt-2">
              <p>SportCareIdet</p>
              <p>Horarios Temporales</p>
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
                {isSelectedOnly ? 'Disponibilidades seleccionadas' : 'Total de Horarios Temporales'}: <span className="font-semibold">{hasData ? disponibilidades.length : 0}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

        {/* Tabla de disponibilidades */}
        <div className="my-6">
          <h3 className="mb-4 text-lg font-medium">Listado completo de Horarios Temporales</h3>
          
          {hasData ? (
            <Table className="w-full text-left rtl:text-right">
              <THead>
                <Tr>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Profesional
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Consultorio
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Fecha Inicio - Fin
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Días
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Horario
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Estado
                  </Th>
                </Tr>
              </THead>
              <TBody>
                {disponibilidades.map((disponibilidad, index) => (
                  <Tr key={disponibilidad.id || index} className="border-b border-gray-200">
                    <Td className="py-2 font-medium text-primary-600">
                      <div className="flex items-center">
                        <UserIcon className="mr-1 size-4" />
                        {disponibilidad.profesional_salud_nombre || 'N/A'}
                      </div>
                    </Td>
                    <Td className="py-2">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="mr-1 size-4" />
                        {disponibilidad.consultorio_nombre || 'N/A'}
                      </div>
                    </Td>
                    <Td className="py-2">
                      {formatDate(disponibilidad.fecha_inicio)} - {formatDate(disponibilidad.fecha_fin)}
                    </Td>
                    <Td className="py-2">
                      {formatDiasSemana(disponibilidad.dias_semana)}
                    </Td>
                    <Td className="py-2">
                      <div className="flex items-center">
                        <ClockIcon className="mr-1 size-4" />
                        {disponibilidad.hora_inicio} - {disponibilidad.hora_fin}
                      </div>
                    </Td>
                    <Td className="py-2">
                      <div className="flex items-center">
                        <CheckCircleIcon className={`mr-1 size-4 ${disponibilidad.activo ? 'text-green-500' : 'text-gray-400'}`} />
                        {disponibilidad.activo ? 'Activo' : 'Inactivo'}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          ) : (
            <div className="p-4 text-center text-gray-500 border border-gray-200 rounded">
              No hay Horarios Temporales disponibles para mostrar
            </div>
          )}
        </div>

        <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

        {/* Pie del documento */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Este documento es un listado oficial de las Horarios Temporales de SportCareIdet.</p>
          <p>© {new Date().getFullYear()} SportCareIdet </p>
        </div>
      </div>
    </div>
  );
});

DisponibilidadTemporalPrintView.propTypes = {
  disponibilidades: PropTypes.array.isRequired,
  isSelectedOnly: PropTypes.bool
};

DisponibilidadTemporalPrintView.displayName = "DisponibilidadTemporalPrintView";