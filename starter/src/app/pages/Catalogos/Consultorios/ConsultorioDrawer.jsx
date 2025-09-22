import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild
} from "@headlessui/react";
import { XMarkIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui";

export function ConsultorioDrawer({ isOpen, close, row }) {
  const consultorio = row.original;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={close}>
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
          className="fixed right-0 top-0 flex h-full w-full max-w-xl transform-gpu flex-col bg-white py-4 transition-transform duration-200 dark:bg-dark-700"
        >
          <div className="flex justify-between px-4 sm:px-5">
            <div>
              <div className="text-xl font-medium text-primary-600 dark:text-primary-400">
                {consultorio.nombre}
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Consultorio
              </div>
            </div>
            <Button
              onClick={close}
              variant="flat"
              isIcon
              className="size-6 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
            >
              <XMarkIcon className="size-4.5" />
            </Button>
          </div>

          <div className="mt-6 space-y-6 px-4 sm:px-5">
            <div>
              <div className="font-semibold">Información General de consultorios</div>
              <div className="mt-2 grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                  <p className="mt-1 font-medium">{consultorio.nombre}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center font-semibold">
                <MapPinIcon className="mr-2 size-5 text-gray-500" />
                <span>Dirección</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Calle</p>
                  <p className="mt-1 font-medium">{consultorio.calle} #{consultorio.numero}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Colonia</p>
                  <p className="mt-1 font-medium">{consultorio.colonia}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Código Postal</p>
                  <p className="mt-1 font-medium">{consultorio.cp}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="font-semibold">Ubicación</div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ciudad</p>
                  <p className="mt-1 font-medium">{consultorio.ciudad}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                  <p className="mt-1 font-medium">{consultorio.estado}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">País</p>
                  <p className="mt-1 font-medium">{consultorio.pais}</p>
                </div>
              </div>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

ConsultorioDrawer.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  row: PropTypes.object,
};