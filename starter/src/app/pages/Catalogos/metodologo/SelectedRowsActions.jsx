// Import Dependencies
import {
  Menu,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ArrowUpTrayIcon,
  PrinterIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { CiViewTable } from "react-icons/ci";
import PropTypes from "prop-types";

// Local Imports
import { Button, GhostSpinner } from "components/ui";
import { deleteMetodologo } from "./api/metodologoList.api"; // Importar la función de eliminar
import { toast } from "sonner"; // Importar toast de sonner

// ----------------------------------------------------------------------

export function SelectedRowsActions({ table, onPrint }) {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const selectedRows = table.getSelectedRowModel().rows;

  // Función mejorada para manejar la eliminación de múltiples filas
  const handleDeleteRows = async () => {
    if (selectedRows.length === 0) return;

    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar ${selectedRows.length} metodólogo${selectedRows.length > 1 ? 's' : ''}? Esta acción no se puede deshacer.`
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);
      
      // Crear array de promesas para eliminar todos los metodólogos seleccionados
      const deletePromises = selectedRows.map(row => 
        deleteMetodologo(row.original.id)
      );

      // Ejecutar todas las eliminaciones en paralelo
      await Promise.all(deletePromises);

      // Si todas las eliminaciones fueron exitosas, actualizar el estado local
      await table.options.meta?.deleteRows(selectedRows);

      // Mostrar notificación de éxito
      toast.success(`${selectedRows.length} metodólogo${selectedRows.length > 1 ? 's' : ''} eliminado${selectedRows.length > 1 ? 's' : ''} correctamente`);
      
    } catch (error) {
      console.error("Error eliminando metodólogos:", error);
      
      // Mostrar mensaje de error específico
      let errorMessage = "Error al eliminar los metodólogos seleccionados";
      
      if (error.response?.status === 404) {
        errorMessage = "Algunos metodólogos ya no existen";
      } else if (error.response?.status === 500) {
        errorMessage = "Error del servidor. Inténtalo más tarde";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
      
      // Opcional: Recargar los datos para sincronizar con el servidor
      if (table.options.meta?.reloadData) {
        await table.options.meta.reloadData();
      }
      
    } finally {
      setDeleteLoading(false);
    }
  };

  // Función para manejar la impresión de las filas seleccionadas - CORREGIDA
  const handlePrintSelected = () => {
    if (selectedRows.length > 0 && typeof onPrint === 'function') {
      const selectedMetodologos = selectedRows.map(row => row.original);
      onPrint(selectedMetodologos); // Pasar los datos seleccionados a la función de impresión
    } else {
      toast.error('No hay metodólogos seleccionados para imprimir');
    }
  };

  return (
    <Transition
      as={Fragment}
      show={table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()}
      enter="transition-all duration-200"
      enterFrom="opacity-0 translate-y-4"
      enterTo="opacity-100 translate-y-0"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-4"
    >
      <div className="pointer-events-none sticky inset-x-0 bottom-0 z-5 flex items-center justify-end">
        <div className="w-full max-w-xl px-2 py-4 sm:absolute sm:-translate-y-1/2 sm:px-4">
          <div className="pointer-events-auto flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2 font-medium text-gray-100 dark:bg-dark-50 dark:text-dark-900 sm:px-4 sm:py-3">
            <p>
              <span>{selectedRows.length} Seleccionado{selectedRows.length !== 1 ? 's' : ''}</span>
              <span className="max-sm:hidden">
                {" "}
                de {table.getCoreRowModel().rows.length}
              </span>
            </p>
            <div className="flex space-x-1.5 rtl:space-x-reverse">
              <Button
                onClick={handleDeleteRows}
                className="w-7 space-x-1.5 rounded-full px-3 py-1.5 text-xs+ sm:w-auto sm:rounded rtl:space-x-reverse"
                color="error"
                disabled={deleteLoading || selectedRows.length <= 0}
              >
                {deleteLoading ? (
                  <div className="flex size-4 items-center justify-center">
                    <GhostSpinner
                      className="size-3.5 shrink-0 border-2"
                      variant="soft"
                    />
                  </div>
                ) : (
                  <TrashIcon className="size-4 shrink-0" />
                )}
                <span className="max-sm:hidden">
                  {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                </span>
              </Button>
              
              {/* Botón de impresión - CORREGIDO */}
              <Button 
                onClick={handlePrintSelected}
                className="w-7 space-x-1.5 rounded-full px-3 py-1.5 text-xs+ sm:w-auto sm:rounded rtl:space-x-reverse"
                disabled={selectedRows.length <= 0}
                variant="outlined"
              >
                <PrinterIcon className="size-4 shrink-0" />
                <span className="max-sm:hidden">Imprimir</span>
              </Button>

              <Menu as="div" className="relative inline-block text-left">
                <Transition
                  as={MenuItems}
                  enter="transition ease-out"
                  enterFrom="opacity-0 translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-2"
                  className="absolute z-[100] min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 text-xs+ text-gray-600 shadow-soft outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:text-dark-200 dark:shadow-none"
                  anchor={{ to: "top end", gap: 6 }}
                >
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse",
                          focus &&
                            "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                        )}
                      >
                        <ArrowUpTrayIcon className="size-4.5" />
                        <span>Export CVS</span>
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse",
                          focus &&
                            "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                        )}
                      >
                        <ArrowUpTrayIcon className="size-4.5" />
                        <span>Export PDF</span>
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse",
                          focus &&
                            "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                        )}
                      >
                        <CiViewTable className="size-4.5" />
                        <span>Save as view</span>
                      </button>
                    )}
                  </MenuItem>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}

SelectedRowsActions.propTypes = {
  table: PropTypes.object.isRequired,
  onPrint: PropTypes.func.isRequired,
};