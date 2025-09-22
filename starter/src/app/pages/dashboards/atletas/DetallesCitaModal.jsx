import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon, CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from "@heroicons/react/24/outline";
import { Button, Badge } from "components/ui";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

function formatTime(timeString) {
  if (!timeString) return "";
  
  const parts = timeString.split(":");
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return timeString;
}

function getBadgeColor(estado) {
  switch (estado) {
    case "Pendiente":
      return "warning";
    case "Confirmada":
      return "success";
    case "Completada":
      return "info";
    case "Cancelada":
      return "error";
    default:
      return "primary";
  }
}

export function DetallesCitaModal({ isOpen, onClose, cita }) {
  if (!cita) return null;

  const {
    id,
    area_nombre,
    consultorio_nombre,
    profesional_salud_nombre,
    slot_hora_inicio,
    slot_hora_fin,
    slot_fecha,
    estado,
    observaciones
  } = cita;

  const formattedDate = formatDate(slot_fecha);
  const timeRange = `${formatTime(slot_hora_inicio)} - ${formatTime(slot_hora_fin)}`;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        onClose={onClose}
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
          <DialogPanel className="relative flex w-full max-w-lg origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-dark-700">
            <div className="flex items-center justify-between rounded-t-lg bg-gray-200 px-4 py-3 dark:bg-dark-800 sm:px-5">
              <DialogTitle
                as="h3"
                className="text-base font-medium text-gray-800 dark:text-dark-100"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-5" />
                  Detalles de la Cita
                </div>
              </DialogTitle>
              <Button
                onClick={onClose}
                variant="flat"
                isIcon
                className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
              >
                <XMarkIcon className="size-4.5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
              <div className="space-y-4">
                {/* Estado */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                    Estado:
                  </span>
                  <Badge color={getBadgeColor(estado)} variant="soft">
                    {estado}
                  </Badge>
                </div>

                {/* ID de Cita */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                    ID de Cita:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-dark-50">
                    #{id}
                  </span>
                </div>

                {/* Fecha */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                      Fecha:
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-dark-50 ml-6">
                    {formattedDate}
                  </p>
                </div>

                {/* Hora */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="size-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                      Horario:
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-dark-50 ml-6">
                    {timeRange}
                  </p>
                </div>

                {/* Profesional */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="size-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                      Profesional de Salud:
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-dark-50 ml-6">
                    {profesional_salud_nombre}
                  </p>
                </div>

                {/* Área */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="size-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                      Área:
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-dark-50 ml-6">
                    {area_nombre}
                  </p>
                </div>

                {/* Consultorio */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="size-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                      Consultorio:
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-dark-50 ml-6">
                    {consultorio_nombre}
                  </p>
                </div>

                {/* Observaciones */}
                {observaciones && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                      Observaciones:
                    </span>
                    <div className="bg-gray-50 dark:bg-dark-600 rounded-lg p-3">
                      <p className="text-sm text-gray-900 dark:text-dark-50">
                        {observaciones}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 rounded-b-lg bg-gray-200 px-4 py-3 dark:bg-dark-800 sm:px-5">
              <Button onClick={onClose} variant="flat">
                Cerrar
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}