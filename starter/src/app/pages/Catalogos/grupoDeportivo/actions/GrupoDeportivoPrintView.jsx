// GrupoDeportivoPrintView.jsx
import { forwardRef } from "react";
import PropTypes from "prop-types";
import { TrophyIcon } from "@heroicons/react/24/outline";
import { Table, THead, TBody, Th, Tr, Td } from "components/ui";

export const GrupoDeportivoPrintView = forwardRef(({ grupos, isSelectedOnly = false }, ref) => {
  const currentDate = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const hasData = Array.isArray(grupos) && grupos.length > 0;

  return (
    <div className="print-container" ref={ref}>
      <div className="flex flex-col px-5 py-12 bg-white sm:px-12">
        {/* Cabecera */}
        <div className="flex flex-col justify-between sm:flex-row">
          <div className="text-center sm:text-left">
            <div className="flex items-center">
              <TrophyIcon className="mr-2 size-6 text-primary-500" />
              <h2 className="text-2xl font-semibold uppercase text-primary-600 dark:text-primary-400">
                Listado de Grupos Deportivos
              </h2>
            </div>
            <div className="space-y-1 pt-2">
              <p>SportCareIdet</p>
              <p>Catálogo de Grupos Deportivos</p>
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
                {isSelectedOnly ? 'Grupos seleccionados' : 'Total de grupos'}: <span className="font-semibold">{hasData ? grupos.length : 0}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

        {/* Tabla de grupos */}
        <div className="my-6">
          <h3 className="mb-4 text-lg font-medium">
            {isSelectedOnly ? 'Grupos seleccionados' : 'Listado completo de grupos deportivos'}
          </h3>
          
          {hasData ? (
            <Table className="w-full text-left rtl:text-right">
              <THead>
                <Tr>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    #
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Nombre
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800">
                    Descripción
                  </Th>
                </Tr>
              </THead>
              <TBody>
                {grupos.map((grupo, index) => (
                  <Tr 
                    key={grupo.id || index} 
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <Td className="py-2 font-medium text-primary-600">
                      {index + 1}
                    </Td>
                    <Td className="py-2 font-medium text-primary-600">
                      {grupo.nombre || 'Sin nombre'}
                    </Td>
                    <Td className="py-2 text-gray-700">
                      {grupo.descripcion && grupo.descripcion.trim() !== '' ? (
                        grupo.descripcion
                      ) : (
                        <span className="text-gray-400 italic">Sin descripción</span>
                      )}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          ) : (
            <div className="p-4 text-center text-gray-500 border border-gray-200 rounded">
              No hay grupos deportivos disponibles para mostrar
            </div>
          )}
        </div>

        <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

        {/* Pie del documento */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Este documento es un listado oficial del catálogo de grupos deportivos de SportCareIdet.</p>
          <p>Generado el {currentDate} - © {new Date().getFullYear()} SportCareIdet</p>
        </div>
      </div>
    </div>
  );
});

GrupoDeportivoPrintView.propTypes = {
  grupos: PropTypes.array.isRequired,
  isSelectedOnly: PropTypes.bool
};

GrupoDeportivoPrintView.defaultProps = {
  isSelectedOnly: false
};

GrupoDeportivoPrintView.displayName = "GrupoDeportivoPrintView";