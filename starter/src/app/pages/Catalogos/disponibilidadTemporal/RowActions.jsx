import { Fragment, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { Button } from "components/ui";
import { DisponibilidadTemporalDrawer } from "./DisponibilidadTemporalDrawer";
import { useDisclosure } from "hooks";
import { UpdateDisponibilidadTemporal } from "./actions/UpdateDisponibilidadTemporalModal";
import { DeleteDisponibilidadAction } from "./actions/DeleteDisponibilidadTemporalModal";
import clsx from "clsx";

export function RowActions({ row, table }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDrawerOpen, { close: closeDrawer, open: openDrawer }] = useDisclosure(false);


  const handleUpdateSuccess = (updatedDisponibilidad) => {
    // Nos aseguramos de que la actualización llegue a la tabla
    console.log("Disponibilidad actualizada:", updatedDisponibilidad);
    
    // Usar directamente el método updateRow del meta de la tabla
    table.options.meta?.updateRow(row.original.id, updatedDisponibilidad);
    
    // Actualizar también las filas visualizadas en la tabla
    const rowIndex = table.getRowModel().rows.findIndex(r => r.original.id === row.original.id);
    if (rowIndex >= 0) {
      // Actualizar también el original en caso de que las refs sean diferentes
      table.options.data[rowIndex] = {...table.options.data[rowIndex], ...updatedDisponibilidad};
    }
  };

  return (
    <>
      <div className="flex justify-center space-x-1.5 rtl:space-x-reverse">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton as={Button} isIcon className="size-8 rounded-full">
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>
          <Transition
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
                      focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
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
                      focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
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
          </Transition>
        </Menu>
      </div>

      <DisponibilidadTemporalDrawer row={row} close={closeDrawer} isOpen={isDrawerOpen} />

      <UpdateDisponibilidadTemporal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        disponibilidad={row.original}
        onUpdate={handleUpdateSuccess}
      />

      <DeleteDisponibilidadAction
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        horario={row.original}
        onDelete={async () => {
          await table.options.meta?.deleteRow(row);
        }}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
};