import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/solid";
import { Fragment } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui";

export function HorarioDrawer({ isOpen, close, row }) {
  const horario = row.original;
  const diasSemana = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo",
  };

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
                Horario de{" "}
                {horario.profesional_salud_nombre ||
                  "Profesional no especificado"}
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Consultorio:{" "}
                {horario.consultorio_nombre || "Consultorio no especificado"}
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
                <span>Profesional de la Salud</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nombre
                  </p>
                  <p className="mt-1 font-medium">
                    {horario.profesional_salud_nombre || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center font-semibold">
                <BuildingOfficeIcon className="mr-2 size-5 text-gray-500" />
                <span>Consultorio</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nombre
                  </p>
                  <p className="mt-1 font-medium">
                    {horario.consultorio_nombre || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center font-semibold">
                <CalendarIcon className="mr-2 size-5 text-gray-500" />
                <span>Día de la semana</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Día
                  </p>
                  <p className="mt-1 font-medium">
                    {diasSemana[horario.dia] || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center font-semibold">
                <ClockIcon className="mr-2 size-5 text-gray-500" />
                <span>Horario</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hora de inicio
                  </p>
                  <p className="mt-1 font-medium">
                    {horario.hora_inicio
                      ? new Date(
                          `1970-01-01T${horario.hora_inicio}`,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No especificada"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hora de fin
                  </p>
                  <p className="mt-1 font-medium">
                    {horario.hora_fin
                      ? new Date(
                          `1970-01-01T${horario.hora_fin}`,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No especificada"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Duración de cita
                  </p>
                  <p className="mt-1 font-medium">
                    {horario.duracion_cita || "30"} minutos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

HorarioDrawer.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  row: PropTypes.object,
};
