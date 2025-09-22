import { Fragment, useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Label,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { XMarkIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Button } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { toast } from "sonner";
import { format, addDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { updateCita, getSlotsDisponiblesParaReagendar } from "./api/api";


    
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReagendarCitaModal({ isOpen, onClose, cita, onReagendar }) {
  const [selectedDate, setSelectedDate] = useState(""); // Cambiar de null a string vacío
  const [slotsDisponibles, setSlotsDisponibles] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState(null);

  // Resetear estados cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(""); // Cambiar de null a string vacío
      setSelectedSlot(null);
      setSlotsDisponibles([]);
      setError(null);
    }
  }, [isOpen]);

  const fetchSlotsDisponibles = useCallback(async () => {
    if (!selectedDate || selectedDate === "" || !cita) return; // Verificar string vacío también

    try {
      setIsLoadingSlots(true);
      setError(null);
      
      const fechaSeleccionada = format(new Date(selectedDate), 'yyyy-MM-dd');
      
      const response = await getSlotsDisponiblesParaReagendar(
        cita.profesional_salud, // Cambiar de profesional_salud_id a profesional_salud
        fechaSeleccionada, 
        fechaSeleccionada
      );
      
      // Filtrar el slot actual para que no aparezca como opción
      const slotsFiltered = response.data.filter(slot => slot.id !== cita.slot);
      
      setSlotsDisponibles(slotsFiltered);
      setSelectedSlot(null); // Reset selected slot when date changes
    } catch (err) {
      console.error("Error al obtener slots disponibles:", err);
      setError("Error al cargar los horarios disponibles");
      setSlotsDisponibles([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [selectedDate, cita]);

  // Obtener slots disponibles cuando se selecciona una fecha
  useEffect(() => {
    if (selectedDate && selectedDate !== "" && cita) { // Verificar que no sea string vacío
      fetchSlotsDisponibles();
    }
  }, [selectedDate, cita, fetchSlotsDisponibles]);

  const handleReagendar = async () => {
    if (!selectedSlot) {
      setError("Debe seleccionar un nuevo horario");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Actualizar la cita con el nuevo slot
      const citaActualizada = {
        ...cita,
        slot: selectedSlot.id,
        estado: "Pendiente" // Cambiar estado a pendiente al reagendar
      };
      
      const response = await updateCita(cita.id, citaActualizada);
      
      // Llamar callback para actualizar la lista
      if (onReagendar) {
        onReagendar(response.data);
      }
      
      toast.success("Cita reagendada correctamente");
      onClose();
    } catch (err) {
      console.error("Error al reagendar cita:", err);
      setError("Error al reagendar la cita");
      toast.error("Error al reagendar la cita");
    } finally {
      setIsLoading(false);
    }
  };

  const formatSlotDisplay = (slot) => {
    const horaInicio = slot.hora_inicio.substring(0, 5);
    const horaFin = slot.hora_fin.substring(0, 5);
    return {
      time: `${horaInicio} - ${horaFin}`,
      consultorio: slot.consultorio_nombre
    };
  };

  // Configuración del DatePicker para permitir solo los próximos 7 días
  const datePickerOptions = {
    disable: [
      function (date) {
        const today = startOfDay(new Date());
        const maxDate = addDays(today, 7);
        return date < today || date > maxDate;
      },
    ],
    locale: {
      firstDayOfWeek: 1,
    },
    minDate: new Date(),
    maxDate: addDays(new Date(), 7)
  };

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
          <DialogPanel className="relative flex w-full max-w-2xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-dark-700">
            <div className="flex items-center justify-between rounded-t-lg bg-gray-200 px-4 py-3 dark:bg-dark-800 sm:px-5">
              <DialogTitle
                as="h3"
                className="text-base font-medium text-gray-800 dark:text-dark-100"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-5" />
                  Reagendar Cita
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

            <div className="flex flex-col overflow-y-auto px-4 py-4 sm:px-5">
              {/* Información de la cita actual */}
              <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-dark-600">
                <h4 className="text-sm font-medium text-gray-800 dark:text-dark-100 mb-2">
                  Cita Actual
                </h4>
                <p className="text-sm text-gray-600 dark:text-dark-300">
                  {cita?.area_nombre} - Dr. {cita?.profesional_salud_nombre}
                </p>
                <p className="text-sm text-gray-600 dark:text-dark-300">
                  {format(new Date(cita?.slot_fecha), "EEE, d MMM yyyy", { locale: es })} - 
                  {cita?.slot_hora_inicio?.substring(0, 5)} a {cita?.slot_hora_fin?.substring(0, 5)}
                </p>
              </div>

              <div className="space-y-4">
                {/* Selector de fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                    Seleccionar nueva fecha
                  </label>
                  <div className="max-w-full">
                    <DatePicker
                      options={datePickerOptions}
                      placeholder="Seleccione una fecha..."
                      value={selectedDate || ""} // Asegurar que nunca sea null
                      onChange={(date) => {
                        setSelectedDate(date || ""); // Manejar null/undefined
                        setError(null);
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                    Solo puede reagendar dentro de los próximos 7 días
                  </p>
                </div>

                {/* Selector de horarios */}
                {selectedDate && selectedDate !== "" && ( // Verificar que no sea string vacío
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                      Horarios disponibles para {format(selectedDate, "EEE, d MMM yyyy", { locale: es })}
                    </label>
                    
                    {isLoadingSlots ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                        <span className="ml-2 text-sm text-gray-600">Cargando horarios...</span>
                      </div>
                    ) : slotsDisponibles.length > 0 ? (
                      <div className="max-w-full">
                        <RadioGroup value={selectedSlot} onChange={setSelectedSlot}>
                          <Label className="sr-only">Horarios disponibles</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {slotsDisponibles.map((slot) => {
                              const slotDisplay = formatSlotDisplay(slot);
                              return (
                                <Radio
                                  key={slot.id}
                                  value={slot}
                                  className={({ active, checked }) =>
                                    `${active && "ring-2 ring-primary-500/50"} 
                                      ${
                                        checked
                                          ? "bg-primary-500 text-white"
                                          : "bg-gray-100 dark:bg-dark-600"
                                      } 
                                        relative flex cursor-pointer rounded-lg px-2 py-2 outline-none transition-colors`
                                  }
                                >
                                  {({ checked }) => (
                                    <>
                                      <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center flex-1">
                                          <div className="text-xs w-full">
                                            <Label
                                              as="p"
                                              className={`font-medium text-center block ${
                                                checked
                                                  ? "text-white"
                                                  : "text-gray-900 dark:text-dark-50"
                                              }`}
                                            >
                                              {slotDisplay.time}
                                            </Label>
                                            <span
                                              className={`inline text-xs block text-center ${
                                                checked
                                                  ? "text-primary-100"
                                                  : "text-gray-500 dark:text-dark-200"
                                              }`}
                                            >
                                              {slotDisplay.consultorio}
                                            </span>
                                          </div>
                                        </div>
                                        {checked && (
                                          <div className="absolute top-1 right-1 text-white">
                                            <CheckIcon className="size-3" />
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </Radio>
                              );
                            })}
                          </div>
                        </RadioGroup>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 dark:text-dark-400">
                          No hay horarios disponibles para esta fecha
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  onClick={onClose}
                  variant="outlined"
                  className="min-w-[7rem] rounded-full"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleReagendar}
                  color="primary"
                  className="min-w-[7rem] rounded-full"
                  loading={isLoading ? "true" : undefined}
                  disabled={!selectedSlot}
                >
                  Reagendar
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}