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
import { GrupoDeportivoDrawer } from "./GrupoDeportivoDrawer";
import { UpdateGrupoDeportivoModal } from "./actions/UpdateGrupoDeportivoModal";
import { DeleteGrupoDeportivoModal } from "./actions/DeleteGrupoDeportivoModal";

export function RowActions({ row, table }) {
  const [isDrawerOpen, { close: closeDrawer, open: openDrawer }] = useDisclosure(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdateGrupo = (id, updatedData) => {
    // Llamar a la función updateRow del meta de la tabla
    table.options.meta?.updateRow(id, updatedData);
  };

  const handleDeleteGrupo = async (row) => {
    // Llamar a la función deleteRow del meta de la tabla
    await table.options.meta?.deleteRow(row);
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

              <div className="my-1 h-px bg-gray-200 dark:bg-dark-500" />

              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse",
                      focus
                        ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        : "text-red-600 dark:text-red-400"
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

      {/* Drawer para visualizar */}
      <GrupoDeportivoDrawer
        isOpen={isDrawerOpen} 
        onClose={closeDrawer} 
        row={row} 
      />

      {/* Modal para editar */}
      <UpdateGrupoDeportivoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        row={row}
        onUpdate={handleUpdateGrupo}
      />

      {/* Modal para eliminar */}
      <DeleteGrupoDeportivoModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        row={row}
        onDelete={handleDeleteGrupo}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};