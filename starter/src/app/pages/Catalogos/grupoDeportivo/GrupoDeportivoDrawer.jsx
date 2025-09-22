// GrupoDeportivoDrawer.jsx
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { 
  XMarkIcon,
  TrophyIcon,
  DocumentTextIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui";

export function GrupoDeportivoDrawer({ isOpen, onClose, row }) {
  const grupo = row?.original;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <TransitionChild
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40"
        />

        <TransitionChild
          as={DialogPanel}
          enter="ease-out transform-gpu transition-transform duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in transform-gpu transition-transform duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="fixed right-0 top-0 flex h-full w-full max-w-md transform-gpu flex-col bg-white py-4 transition-transform duration-200 dark:bg-dark-700"
        >
          <div className="flex justify-between px-4 sm:px-5">
            <div className="flex items-center">
              <TrophyIcon className="mr-2 size-6 text-primary-500" />
              <div>
                <div className="text-xl font-medium text-gray-800 dark:text-dark-100">
                  {grupo?.nombre || 'Sin nombre'}
                </div>
                <div className="text-sm text-gray-500 dark:text-dark-200">
                  Detalles del grupo deportivo
                </div>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="flat"
              isIcon
              className="size-6 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
            >
              <XMarkIcon className="size-4.5" />
            </Button>
          </div>

          <div className="mt-6 space-y-4 px-4 sm:px-5">
            {/* Información básica */}
            <div className="flex items-start">
              <InformationCircleIcon className="mr-3 mt-1 size-5 text-gray-400 flex-shrink-0" />
              <div className="w-full">
                <h3 className="font-medium text-gray-800 dark:text-dark-100">Información básica</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-600 dark:text-dark-200">
                    <span className="font-medium">Nombre:</span> {grupo?.nombre || 'No especificado'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-dark-200">
                    <span className="font-medium">ID:</span> {grupo?.id || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="flex items-start">
              <DocumentTextIcon className="mr-3 mt-1 size-5 text-gray-400 flex-shrink-0" />
              <div className="w-full">
                <h3 className="font-medium text-gray-800 dark:text-dark-100">Descripción</h3>
                <div className="mt-2">
                  {grupo?.descripcion && grupo.descripcion.trim() !== '' ? (
                    <p className="text-sm text-gray-600 dark:text-dark-200 leading-relaxed">
                      {grupo.descripcion}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-dark-300 italic">
                      Sin descripción disponible
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Mensaje si no hay datos */}
            {!grupo && (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-gray-500 dark:text-dark-300">
                  No hay información disponible para mostrar
                </p>
              </div>
            )}
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

GrupoDeportivoDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  row: PropTypes.object,
};