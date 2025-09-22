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
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";
import { CategoriaDrawer } from "./CategoriaDrawer";
import { useDisclosure } from "hooks";
import { CreateCategoriaModal } from "./CreateCategoriaModal";

const confirmMessages = {
  pending: {
    description: "¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.",
  },
  success: {
    title: "Categoría eliminada",
    description: "La categoría ha sido eliminada correctamente.",
  },
  error: {
    title: "Error al eliminar",
    description: "Hubo un problema al eliminar la categoría. Por favor, inténtalo de nuevo.",
  }
};

export function RowActions({ row, table }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isDrawerOpen, { close: closeDrawer, open: openDrawer }] =
    useDisclosure(false);

  const closeModal = () => {
    setDeleteModalOpen(false);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteRows = useCallback(async () => {
    setConfirmDeleteLoading(true);
    try {
      await table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      console.error("Error deleting categoria:", err);
      setDeleteError(true);
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [row, table, closeModal]);

  const handleEditSuccess = (updatedCategoria) => {
    table.options.meta?.updateRow(row.id, updatedCategoria);
    setIsEditModalOpen(false);
  };

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

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
                    onClick={() => openDrawer()}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
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
                    onClick={() => setIsEditModalOpen(true)}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
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

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />

      <CategoriaDrawer row={row} close={closeDrawer} isOpen={isDrawerOpen} />

      <CreateCategoriaModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCreate={handleEditSuccess}
        categoriaToEdit={row.original}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};