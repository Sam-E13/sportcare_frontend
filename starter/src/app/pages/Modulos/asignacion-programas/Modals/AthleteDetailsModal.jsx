// src/app/pages/Modulos/asignacion-programas/Modals/AthleteDetailsModal.jsx

import PropTypes from "prop-types";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon, UserCircleIcon, CakeIcon } from "@heroicons/react/24/outline";
import { Avatar, Button } from "components/ui";

export function AthleteDetailsModal({ isOpen, close, athlete }) {
  if (!athlete) return null;

  const fullName = `${athlete.nombre} ${athlete.apPaterno} ${athlete.apMaterno}`;

  return (
    <Transition appear show={isOpen} as="div">
      <Dialog as="div" className="relative z-[100]" onClose={close}>
        <TransitionChild
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 transition-opacity dark:bg-black/40" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={DialogPanel}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
              className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-dark-700"
            >
              <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-50">
                Detalles del Atleta
              </DialogTitle>
              <Button isIcon variant="flat" onClick={close} className="absolute right-4 top-4 !rounded-full">
                  <XMarkIcon className="size-5" />
              </Button>

              <div className="mt-4 flex flex-col items-center">
                <Avatar src={athlete.foto} name={fullName} size={24} className="ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-dark-700" />
                <h4 className="mt-3 text-xl font-bold">{fullName}</h4>
                <p className="text-sm text-gray-500 dark:text-dark-300">{athlete.deporte || 'Deporte no especificado'}</p>
              </div>

              <div className="mt-6 space-y-3 border-t border-gray-200 pt-5 dark:border-dark-600">
                <div className="flex items-center gap-3">
                  <UserCircleIcon className="size-5 text-gray-400 dark:text-dark-300" />
                  <span className="text-gray-700 dark:text-dark-200">{athlete.sexo === 'M' ? 'Masculino' : 'Femenino'}</span>
                </div>
               
                <div className="flex items-center gap-3">
                  <CakeIcon className="size-5 text-gray-400 dark:text-dark-300" />
                  <span className="text-gray-700 dark:text-dark-200">
                    Fecha de Nacimiento: {athlete.fechaNacimiento ? new Date(athlete.fechaNacimiento).toLocaleDateString() : 'No especificada'}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="soft" onClick={close}>
                  Cerrar
                </Button>
              </div>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

AthleteDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  athlete: PropTypes.object,
};