import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import {
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { AnimatedTick } from "components/shared/AnimatedTick";
import { toast } from "sonner";

const confirmMessages = {
  pending: {
    Icon: ExclamationTriangleIcon,
    iconClassName: "text-warning",
    title: "¿Estás seguro?",
    description: "¿Estás seguro de que deseas eliminar este entrenador? Una vez eliminado, no se puede recuperar.",
    actionText: "Eliminar"
  },
  success: {
    Icon: AnimatedTick,
    iconClassName: "text-success",
    title: "Entrenador Eliminado",
    description: "El entrenador ha sido eliminado correctamente.",
    actionText: "Hecho"
  },
  error: {
    Icon: XCircleIcon,
    iconClassName: "text-error",
    title: "Error al Eliminar",
    description: "Ocurrió un error al intentar eliminar el entrenador.",
    actionText: "Reintentar"
  }
};

export function DeleteEntrenadorModal({ onDelete, onClose, isOpen }) {
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const handleDelete = async () => {
    try {
      setConfirmDeleteLoading(true);
      const loadingToast = toast.loading('Eliminando entrenador...', {
        position: 'top-center'
      });
      
      await onDelete();
      
      toast.dismiss(loadingToast);
      toast.success('Entrenador eliminado correctamente', {
        position: 'top-center',
        duration: 3000
      });
      
      setDeleteSuccess(true);
      setDeleteError(false);
      
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Error eliminando entrenador:", error);
      
      toast.dismiss();
      toast.error('Error al eliminar el entrenador', {
        position: 'top-center',
        duration: 3000
      });
      
      setDeleteError(true);
      setDeleteSuccess(false);
    } finally {
      setConfirmDeleteLoading(false);
    }
  };

  const handleClose = () => {
    if (!confirmDeleteLoading) {
      onClose();
      setDeleteSuccess(false);
      setDeleteError(false);
    }
  };

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";
  const { Icon, iconClassName, title, description, actionText } = confirmMessages[state];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-dark-700">
                <div className="flex flex-col items-center space-y-4">
                  <div className={`rounded-full p-3 ${iconClassName}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900 dark:text-dark-100"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="text-center text-sm text-gray-500 dark:text-dark-300">
                    {description}
                  </div>
                </div>

                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 dark:border-dark-500 dark:bg-dark-600 dark:text-dark-100"
                    onClick={handleClose}
                    disabled={confirmDeleteLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 ${
                      state === "error" 
                        ? "bg-error hover:bg-error-dark dark:bg-error-light dark:hover:bg-error" 
                        : "bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                    }`}
                    onClick={handleDelete}
                    disabled={confirmDeleteLoading}
                  >
                    {confirmDeleteLoading ? (
                      <span>Procesando...</span>
                    ) : (
                      actionText
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

DeleteEntrenadorModal.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};