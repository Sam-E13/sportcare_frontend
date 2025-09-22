import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Agrega esta constante con los valores por defecto para statusOptions
const STATUS_OPTIONS = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
  completed: { color: 'bg-green-100 text-green-800', label: 'Completado' },
  cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelado' },
  // Agrega más estados según sea necesario
};

export function OrdersDrawer({ row, isOpen, close }) {
  // Verifica y asigna un estado por defecto si es necesario
  const status = row?.original?.status || 'pending';
  const statusOption = STATUS_OPTIONS[status] || STATUS_OPTIONS.pending;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl dark:bg-dark-700">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-dark-100">
                          Detalles del Responsable
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none dark:bg-dark-700 dark:text-dark-300"
                            onClick={close}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {/* Contenido del drawer */}
                      <div className="space-y-4">
                        <div>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusOption.color}`}>
                            {statusOption.label}
                          </span>
                        </div>
                        
                        {/* Agrega más detalles del responsable aquí */}
                        {row?.original?.nombre && (
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-dark-100">Nombre</h3>
                            <p className="text-gray-600 dark:text-dark-300">{row.original.nombre}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

OrdersDrawer.propTypes = {
  row: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};