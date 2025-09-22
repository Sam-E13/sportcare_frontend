import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon, UserIcon, IdentificationIcon, CakeIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui";

export function AtletaDrawer({ isOpen, close, row }) {
  const atleta = row.original;

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
                {atleta.nombre} {atleta.apPaterno} {atleta.apMaterno}
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Atleta
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
              <div className="flex items-center font-semibold">
                <UserIcon className="mr-2 size-5 text-gray-500" />
                <span>Información Personal</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                  <p className="mt-1 font-medium">{atleta.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Apellido Paterno</p>
                  <p className="mt-1 font-medium">{atleta.apPaterno}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Apellido Materno</p>
                  <p className="mt-1 font-medium">{atleta.apMaterno}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sexo</p>
                  <p className="mt-1 font-medium">
                    {atleta.sexo === 'M' ? 'Masculino' : 'Femenino'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estado Civil</p>
                  <p className="mt-1 font-medium">{atleta.estadoCivil}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tipo de Sangre</p>
                  <p className="mt-1 font-medium">{atleta.tipoSangre}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center font-semibold">
                <CakeIcon className="mr-2 size-5 text-gray-500" />
                <span>Datos de Nacimiento</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de Nacimiento</p>
                  <p className="mt-1 font-medium">
                    {new Date(atleta.fechaNacimiento).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Edad</p>
                  <p className="mt-1 font-medium">
                    {Math.floor((new Date() - new Date(atleta.fechaNacimiento)) / (1000 * 60 * 60 * 24 * 365))} años
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center font-semibold">
                <IdentificationIcon className="mr-2 size-5 text-gray-500" />
                <span>Identificación Oficial</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CURP</p>
                  <p className="mt-1 font-medium">{atleta.curp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">RFC</p>
                  <p className="mt-1 font-medium">{atleta.rfc}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="font-semibold">Deportes</div>
              <div className="mt-2">
              {atleta.deportes && atleta.deportes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {atleta.deportes.map((deporte, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium  text-black-900">
                    {deporte}
                  </span>
                ))}
              </div>
                ) : (
                  <p className="text-sm text-gray-500">No hay deportes registrados</p>
                )}
              </div>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

AtletaDrawer.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  row: PropTypes.object,
};