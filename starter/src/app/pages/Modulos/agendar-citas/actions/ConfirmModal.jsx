import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Button, Select } from "components/ui";
import { getAllAtletas, createCita } from "../api/CitasDisponiblesApi";
import { useAuthContext } from "app/contexts/auth/context";
import { toast } from "sonner";

export function ReservationModal({ isOpen, onClose, slotData, onReservationSuccess }) {
  const { isAuthenticated } = useAuthContext();
  
  const [formData, setFormData] = useState({
    selectedAtleta: ""
  });
  
  const [atletas, setAtletas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [atletasLoading, setAtletasLoading] = useState(false);
  const [error, setError] = useState(null);

  const safeSlotData = {
    area: slotData?.area || "No especificada",
    consultorio: slotData?.consultorio || "No especificado",
    profesional: slotData?.profesional || "No especificado",
    formattedFecha: slotData?.formattedFecha || "No especificada",
    horaInicioStr: slotData?.horaInicioStr || "--:--",
    horaFinStr: slotData?.horaFinStr || "--:--",
    slotId: slotData?.slotId,
    areaId: slotData?.areaId,
    consultorioId: slotData?.consultorioId,
    profesionalId: slotData?.profesionalId,
  };

  // Cargar atletas cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadAtletas();
      setFormData({ selectedAtleta: "" });
      setError(null);
    }
  }, [isOpen]);

  const loadAtletas = async () => {
    setAtletasLoading(true);
    try {
      const response = await getAllAtletas();
      let atletasData = [];
      
      if (response.data?.results && Array.isArray(response.data.results)) {
        atletasData = response.data.results;
      } else if (Array.isArray(response.data)) {
        atletasData = response.data;
      }
      
      setAtletas(atletasData);
    } catch (error) {
      console.error("Error cargando atletas:", error);
      setError("Error al cargar la lista de atletas");
      toast.error("Error al cargar atletas");
    } finally {
      setAtletasLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError("Sesión no válida");
      return;
    }

    if (!formData.selectedAtleta) {
      setError("Debes seleccionar un atleta");
      return;
    }

    if (
      !safeSlotData.slotId ||
      !safeSlotData.areaId ||
      !safeSlotData.consultorioId ||
      !safeSlotData.profesionalId
    ) {
      setError("Información del horario incompleta");
      return;
    }

    try {
      setIsLoading(true);
      
      await createCita({
        atleta: parseInt(formData.selectedAtleta),
        slot: safeSlotData.slotId,
        area: safeSlotData.areaId,
        consultorio: safeSlotData.consultorioId,
        profesional_salud: safeSlotData.profesionalId,
        estado: "Pendiente",
      });

      toast.success("¡Cita reservada exitosamente!");
      onClose();
      if (onReservationSuccess) {
        onReservationSuccess();
      }
    } catch (error) {
      console.error("Error en reserva:", error);
      
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data?.non_field_errors) {
        setError(error.response.data.non_field_errors[0]);
      } else if (error.response?.status === 400) {
        const firstErrorKey = Object.keys(error.response?.data || {})[0];
        const firstError = error.response?.data[firstErrorKey];

        if (Array.isArray(firstError)) {
          setError(`Error en ${firstErrorKey}: ${firstError[0]}`);
        } else if (typeof firstError === "string") {
          setError(`Error: ${firstError}`);
        } else {
          setError("Error de validación en el servidor");
        }
      } else {
        setError("Error al procesar la reserva. Verifica tu conexión e inténtalo nuevamente");
      }
      
      toast.error("Error al reservar la cita");
    } finally {
      setIsLoading(false);
    }
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
          <DialogPanel className="relative flex w-full max-w-lg origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-dark-700">
            <div className="flex items-center justify-between rounded-t-lg bg-gray-200 px-4 py-3 dark:bg-dark-800 sm:px-5">
              <div className="flex items-center space-x-3">
                <CalendarDaysIcon className="size-6 text-primary-600 dark:text-primary-400" />
                <DialogTitle
                  as="h3"
                  className="text-base font-medium text-gray-800 dark:text-dark-100"
                >
                  Confirmar Reserva de Cita
                </DialogTitle>
              </div>
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
              {/* Detalles de la cita */}
              <div className="mb-6">
                <h4 className="mb-3 font-medium text-gray-700 dark:text-dark-100">
                  Detalles de la Cita
                </h4>
                <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-dark-600">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-dark-300">
                      Área:
                    </span>
                    <span className="col-span-2 text-sm text-gray-800 dark:text-dark-100">
                      {safeSlotData.area}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-dark-300">
                      Consultorio:
                    </span>
                    <span className="col-span-2 text-sm text-gray-800 dark:text-dark-100">
                      {safeSlotData.consultorio}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-dark-300">
                      Profesional:
                    </span>
                    <span className="col-span-2 text-sm text-gray-800 dark:text-dark-100">
                      {safeSlotData.profesional}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-dark-300">
                      Fecha:
                    </span>
                    <span className="col-span-2 text-sm text-gray-800 dark:text-dark-100">
                      {safeSlotData.formattedFecha}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-dark-300">
                      Horario:
                    </span>
                    <span className="col-span-2 text-sm text-gray-800 dark:text-dark-100">
                      {safeSlotData.horaInicioStr} - {safeSlotData.horaFinStr}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selector de atleta */}
              <div className="space-y-4">
                <Select
                  label="Seleccionar Atleta"
                  name="selectedAtleta"
                  value={formData.selectedAtleta}
                  onChange={handleInputChange}
                  disabled={atletasLoading}
                  required
                >
                  <option value="">
                    {atletasLoading ? "Cargando atletas..." : "Selecciona un atleta"}
                  </option>
                  {atletas.map((atleta) => (
                    <option key={atleta.id} value={atleta.id}>
                      {atleta.nombre} {atleta.apPaterno} {atleta.apMaterno}
                    </option>
                  ))}
                </Select>
              </div>
              
              {error && (
                <div className="mt-4 rounded-md bg-error-50 p-3 text-sm text-error dark:bg-error-900/20 dark:text-error-light">
                  {error}
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  onClick={onClose}
                  variant="outlined"
                  className="min-w-[7rem] rounded-full"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  color="primary"
                  className="min-w-[7rem] rounded-full"
                  loading={isLoading ? "true" : undefined}
                  disabled={!formData.selectedAtleta || atletasLoading}
                >
                  Confirmar Reserva
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

export default ReservationModal;

export const useReservationModal = (slotData) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
    ReservationModal: (props) => (
      <ReservationModal
        isOpen={isOpen}
        onClose={close}
        slotData={slotData}
        {...props}
      />
    ),
  };
};
