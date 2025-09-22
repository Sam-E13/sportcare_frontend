import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition as MenuTransition,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui";
import { useDisclosure } from "hooks";
import { UpdateMetodologoModal } from "./actions/UpdateMetodologoModal";
import { MetodologoDeleteModal } from "./actions/MetodologoDeleteModal"; // Importar el modal bonito
import { deleteMetodologo } from "./api/metodologoList.api";
import { toast } from "sonner";

// Componente temporal para el drawer
const MetodologoDrawer = ({ isOpen, onClose, row }) => {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="fixed right-0 top-0 h-full w-96 bg-white p-6 dark:bg-dark-700">
        <button onClick={onClose} className="mb-4 text-gray-500 dark:text-gray-300">Cerrar</button>
        <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Detalles del Metodólogo</h2>
        <div className="space-y-2">
          <p className="dark:text-gray-200"><strong>Nombre:</strong> {row?.original?.nombre}</p>
          <p className="dark:text-gray-200"><strong>Apellido Paterno:</strong> {row?.original?.aPaterno}</p>
          <p className="dark:text-gray-200"><strong>Apellido Materno:</strong> {row?.original?.aMaterno}</p>
          <p className="dark:text-gray-200"><strong>Usuario:</strong> {row?.original?.usuario?.username || row?.original?.usuario?.email || 'No asignado'}</p>
          {/* Agregar más campos según sea necesario */}
        </div>
      </div>
    </div>
  );
};

export function RowActions({ row, table }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDrawerOpen, { close: closeDrawer, open: openDrawer }] = useDisclosure(false);

  const handleUpdateSuccess = (id, updatedData) => {
    table.options.meta?.updateRow(id, updatedData);
    toast.success('Metodólogo actualizado correctamente');
  };

  const handleDeleteSuccess = async (row) => {
    const metodologo = row.original;
    
    try {
      // Llamar a la API para eliminar el metodólogo
      await deleteMetodologo(metodologo.id);
      
      // Si la eliminación fue exitosa, actualizar el estado local
      table.options.meta?.deleteRow(row);
      
      // Cerrar el modal
      setIsDeleteModalOpen(false);
      
      // El modal ya maneja los toasts, así que no necesitamos duplicarlos aquí
      
    } catch (error) {
      console.error('Error al eliminar metodólogo:', error);
      
      // Re-lanzar el error para que el modal lo maneje
      throw error;
    }
  };

  return (
    <>
      <div className="flex justify-center space-x-1.5 rtl:space-x-reverse">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton as={Button} isIcon className="size-8 rounded-full">
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>
          <MenuTransition
            as={Fragment}
            enter="transition ease-out"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <MenuItems
              anchor={{ to: "bottom end", gap: 12 }}
              className="absolute z-[100] w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0"
            >
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={openDrawer}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                    )}
                  >
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>Visualizar</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                    )}
                  >
                    <PencilIcon className="size-4.5 stroke-1" />
                    <span>Editar</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-error outline-none transition-colors dark:text-error-light rtl:space-x-reverse",
                      focus && "bg-error/10 dark:bg-error-light/10"
                    )}
                  >
                    <TrashIcon className="size-4.5 stroke-1" />
                    <span>Eliminar</span>
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </MenuTransition>
        </Menu>
      </div>

      <MetodologoDrawer 
        isOpen={isDrawerOpen} 
        onClose={closeDrawer} 
        row={row} 
      />

      <UpdateMetodologoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        row={row}
        onUpdate={handleUpdateSuccess}
        table={table}
      />

      <MetodologoDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        row={row}
        onDelete={handleDeleteSuccess}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};