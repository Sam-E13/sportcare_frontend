// HorarioPrintView.jsx
import PropTypes from "prop-types";
import { CalendarIcon, ClockIcon, UserIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { forwardRef } from "react";
import { Table, THead, TBody, Th, Tr, Td } from "components/ui";

export const HorarioPrintView = forwardRef(({ horarios, isSelectedOnly = false }, ref) => {
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

  // Add a check to ensure horarios array exists and has items
  const hasData = Array.isArray(horarios) && horarios.length > 0;

  return (
    <div className="print-container" ref={ref}>
      <div className="flex flex-col px-5 py-12 bg-white sm:px-12">
        {/* Cabecera */}
        <div className="flex flex-col justify-between sm:flex-row">
          <div className="text-center sm:text-left">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 size-6 text-primary-500" />
              <h2 className="text-2xl font-semibold uppercase text-primary-600 dark:text-primary-400">
                Listado de Horarios
              </h2>
            </div>
            <div className="space-y-1 pt-2">
              <p>SportCareIdet</p>
              <p>Horarios de Profesionales</p>
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
                {isSelectedOnly ? 'Horarios seleccionados' : 'Total de horarios'}: <span className="font-semibold">{hasData ? horarios.length : 0}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

        {/* Tabla de horarios */}
        <div className="my-6">
          <h3 className="mb-4 text-lg font-medium">Listado completo de horarios</h3>
          
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
                    Día
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Horario
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Duración cita
                  </Th>
                </Tr>
              </THead>
              <TBody>
                {horarios.map((horario, index) => (
                  <Tr key={horario.id || index} className="border-b border-gray-200">
                    <Td className="py-2 font-medium text-primary-600">
                      <div className="flex items-center">
                        <UserIcon className="mr-1 size-4" />
                        {horario.profesional_salud_nombre || 'N/A'}
                      </div>
                    </Td>
                    <Td className="py-2">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="mr-1 size-4" />
                        {horario.consultorio_nombre || 'N/A'}
                      </div>
                    </Td>
                    <Td className="py-2">
                      {diasSemana[horario.dia] || `Día ${horario.dia}`}
                    </Td>
                    <Td className="py-2">
                      <div className="flex items-center">
                        <ClockIcon className="mr-1 size-4" />
                        {horario.hora_inicio} - {horario.hora_fin}
                      </div>
                    </Td>
                    <Td className="py-2">
                      {horario.duracion_cita} minutos
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          ) : (
            <div className="p-4 text-center text-gray-500 border border-gray-200 rounded">
              No hay horarios disponibles para mostrar
            </div>
          )}
        </div>

        <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

        {/* Pie del documento */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Este documento es un listado oficial de los horarios de atención de SportCareIdet.</p>
          <p>© {new Date().getFullYear()} SportCareIdet </p>
        </div>
      </div>
    </div>
  );
});

HorarioPrintView.propTypes = {
  horarios: PropTypes.array.isRequired
};

HorarioPrintView.displayName = "HorarioPrintView";