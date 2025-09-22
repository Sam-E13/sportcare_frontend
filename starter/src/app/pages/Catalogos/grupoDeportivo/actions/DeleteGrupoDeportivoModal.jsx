import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "components/ui";
import { AnimatedTick } from "components/shared/AnimatedTick";
import { ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

const confirmMessages = {
  pending: {
    Icon: ExclamationTriangleIcon,
    iconClassName: "text-warning",
    title: "¿Estás seguro?",
    description: (grupo) => `¿Estás seguro de que deseas eliminar el grupo deportivo "${grupo.nombre}"? Esta acción eliminará también todos los deportes asociados y no se puede deshacer.`,
    actionText: "Eliminar"
  },
  success: {
    Icon: AnimatedTick,
    iconClassName: "text-success",
    title: "¡Eliminado!",
    description: () => "El grupo deportivo ha sido eliminado correctamente del sistema.",
    actionText: "Hecho"
  },
  error: {
    Icon: XCircleIcon,
    iconClassName: "text-error",
    title: "Error",
    description: (grupo) => `No se pudo eliminar el grupo deportivo "${grupo.nombre}". Verifica que no esté siendo usado en otros registros.`,
    actionText: "Reintentar"
  }
};

export function DeleteGrupoDeportivoModal({ isOpen, onClose, row, onDelete }) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("pending");
  const grupo = row?.original || {};

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete(row);
      setStatus("success");
      toast.success(`Grupo deportivo "${grupo.nombre}" eliminado correctamente`);
    } catch (error) {
      console.error("Error deleting grupo deportivo:", error);
      setStatus("error");
      toast.error(`Error al eliminar el grupo deportivo "${grupo.nombre}"`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setTimeout(() => setStatus("pending"), 300);
    }
  };

  const currentMessage = confirmMessages[status];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        onClose={handleClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/30" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPanel className="relative flex w-full max-w-md origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-dark-700">
            <div className="flex items-center justify-between rounded-t-lg bg-gray-200 px-4 py-3 dark:bg-dark-800 sm:px-5">
              <DialogTitle
                as="h3"
                className="text-base font-medium text-gray-800 dark:text-dark-100"
              >
                {currentMessage.title}
              </DialogTitle>
              <Button
                onClick={handleClose}
                variant="flat"
                isIcon
                className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                disabled={isLoading}
              >
                <XMarkIcon className="size-4.5" />
              </Button>
            </div>

            <div className="flex flex-col items-center px-4 py-6 sm:px-5 sm:py-8">
              <div className={`mb-4 size-12 ${currentMessage.iconClassName}`}>
                <currentMessage.Icon className="size-full" />
              </div>
              <p className="text-center text-gray-800 dark:text-dark-100">
                {currentMessage.description(grupo)}
              </p>
              {status === "error" && (
                <p className="mt-2 text-sm text-gray-500 dark:text-dark-200">
                  Por favor intenta nuevamente o contacta al administrador.
                </p>
              )}
              {status === "pending" && (
                <div className="mt-3 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Advertencia:</strong> Esta acción es permanente y eliminará todos los deportes asociados a este grupo.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 px-4 py-4 sm:px-5">
              {status === "pending" && (
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  className="min-w-[7rem] rounded-full"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}
              <Button
                onClick={status === "success" ? handleClose : handleDelete}
                color={status === "error" ? "error" : status === "pending" ? "error" : "primary"}
                className="min-w-[7rem] rounded-full"
                loading={isLoading}
              >
                {currentMessage.actionText}
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}