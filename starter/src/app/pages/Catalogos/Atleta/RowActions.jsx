import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ArrowUpRightIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui";
import { AtletaDrawer } from "./AtletaDrawer";
import { useDisclosure } from "hooks";
import { DeleteAtletaModal } from "./DeleteAtletaModal";
import { UpdateAtletaModal } from "./UpdateAtletaModal";
import { AtletaContactoModal } from "./AtletaContactoModal";
import { deleteAtleta } from "./api/atletaList.api";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/outline";

export function RowActions({ row, table }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [contactoModalOpen, setContactoModalOpen] = useState(false);
  const [isDrawerOpen, { close: closeDrawer, open: openDrawer }] = useDisclosure(false);
  const navigate = useNavigate();

  const handleDelete = useCallback(async () => {
    try {
      await deleteAtleta(row.original.id);
      table.options.meta?.deleteRow(row);
    } catch (error) {
      console.error("Error al eliminar atleta:", error);
    } finally {
      setDeleteModalOpen(false);
    }
  }, [row, table]);

  const handleUpdate = useCallback((updatedAtleta) => {
    table.options.meta?.updateData(row.index, updatedAtleta);
    setUpdateModalOpen(false);
  }, [row, table]);

  return (
    <>
      <div className="flex justify-center space-x-1.5 rtl:space-x-reverse">
        <Button
          isIcon
          className="size-8 rounded-full"
          onClick={() => openDrawer()}
        >
          <ArrowUpRightIcon className="size-4" />
        </Button>

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
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse",
                      focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>Ver</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => setUpdateModalOpen(true)}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse",
                      focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
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
                    onClick={() => setContactoModalOpen(true)}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse",
                      focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <PhoneIcon className="size-4.5 stroke-1" /> {/* Icono cambiado aquí */}
                    <span>Contacto</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => navigate(`/Catalogos/Responsable/${row.original.id}`)}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse",
                      focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                    )}
                  >
                    <UserIcon className="size-4.5 stroke-1" />
                    <span>Responsable</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-error outline-none transition-colors dark:text-error-light rtl:space-x-reverse",
                      focus && "bg-error/10 dark:bg-error-light/10",
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

      <DeleteAtletaModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
      />

      <UpdateAtletaModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        atleta={row.original}
        onUpdate={handleUpdate}
      />

      <AtletaContactoModal
        isOpen={contactoModalOpen}
        onClose={() => setContactoModalOpen(false)}
        atleta={row.original}
      />

      <AtletaDrawer row={row} close={closeDrawer} isOpen={isDrawerOpen} />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};