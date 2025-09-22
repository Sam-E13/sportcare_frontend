import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input, Select } from "components/ui";
import {
  getAllProfesionales,
  getAllConsultorios,
  updateHorario,
} from "../api/horarioList.api";
import { toast } from "sonner";

export function UpdateHorarioModal({ isOpen, onClose, horario, onUpdate }) {
  const [formData, setFormData] = useState({
    profesional_salud: null,  // número entero
    consultorio: null,        // número entero
    dia: null,               // número entero
    hora_inicio: "",
    hora_fin: "",
    duracion_cita: 30,
  });

  const [profesionales, setProfesionales] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const diasSemana = [
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
    { value: 7, label: "Domingo" },
  ];

  useEffect(() => {
    if (isOpen && horario && !isInitialized) {
      const loadData = async () => {
        try {
          const [profesionalesRes, consultoriosRes] = await Promise.all([
            getAllProfesionales(),
            getAllConsultorios(),
          ]);

          setProfesionales(
            profesionalesRes.data.map((p) => ({
              label: p.nombre,
              value: p.id,  // mantener como número
            }))
          );

          setConsultorios(
            consultoriosRes.data.map((c) => ({
              label: c.nombre,
              value: c.id,  // mantener como número
            }))
          );

          // Establecer valores numéricos directamente
          setFormData({
            profesional_salud: typeof horario.profesional_salud === 'object'
              ? horario.profesional_salud.id
              : horario.profesional_salud,
            consultorio: typeof horario.consultorio === 'object'
              ? horario.consultorio.id
              : horario.consultorio,
            dia: horario.dia || null,
            hora_inicio: horario.hora_inicio || "",
            hora_fin: horario.hora_fin || "",
            duracion_cita: horario.duracion_cita || 30,
          });

          setIsInitialized(true);
        } catch (err) {
          console.error("Error cargando opciones:", err);
          setError("Error al cargar las opciones");
        }
      };

      loadData();
    }

    if (!isOpen) {
      setIsInitialized(false);
    }
  }, [isOpen, horario, isInitialized]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    // Convertir a número solo si hay valor
    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseInt(value, 10) : null,
    }));
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    // Validación que verifica null/undefined/empty string
    const requiredFields = [
      { name: 'profesional_salud', label: 'Profesional' },
      { name: 'consultorio', label: 'Consultorio' },
      { name: 'dia', label: 'Día' },
      { name: 'hora_inicio', label: 'Hora inicio' },
      { name: 'hora_fin', label: 'Hora fin' }
    ];

    const missingFields = requiredFields.filter(field => {
      const value = formData[field.name];
      return value === null || value === undefined || value === "";
    });

    if (missingFields.length > 0) {
      setError(`Faltan campos requeridos: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    // Validación de horas
    if (formData.hora_inicio >= formData.hora_fin) {
      setError("La hora de fin debe ser posterior a la hora de inicio");
      return;
    }

    try {
      setIsLoading(true);

      // Preparar payload (ya tenemos los tipos correctos)
      const payload = {
        profesional_salud: formData.profesional_salud,
        consultorio: formData.consultorio,
        dia: formData.dia,
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        duracion_cita: formData.duracion_cita,
      };

      const response = await updateHorario(horario.id, payload);
      onUpdate(response.data);
      onClose();
      toast.success("Horario actualizado correctamente");
    } catch (err) {
      console.error("Error al actualizar:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error al actualizar el horario");
      toast.error(" OOPS! Ocurrió un error al actualizar el horario")
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
              <DialogTitle
                as="h3"
                className="text-base font-medium text-gray-800 dark:text-dark-100"
              >
                Editar Horario
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
              {error && (
                <div className="mb-4 text-sm text-error dark:text-error-light">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Select
                  label="Profesional"
                  name="profesional_salud"
                  value={formData.profesional_salud ?? ""}
                  onChange={handleSelectChange}
                  data={profesionales}
                  required
                />

                <Select
                  label="Consultorio"
                  name="consultorio"
                  value={formData.consultorio ?? ""}
                  onChange={handleSelectChange}
                  data={consultorios}
                  required
                />

                <Select
                  label="Día de la semana"
                  name="dia"
                  value={formData.dia ?? ""}
                  onChange={handleSelectChange}
                  data={diasSemana}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Hora Inicio"
                    name="hora_inicio"
                    type="time"
                    value={formData.hora_inicio}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    label="Hora Fin"
                    name="hora_fin"
                    type="time"
                    value={formData.hora_fin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Input
                  label="Duración Cita (minutos)"
                  name="duracion_cita"
                  type="number"
                  min="1"
                  value={formData.duracion_cita}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  onClick={onClose}
                  variant="outlined"
                  className="min-w-[7rem] rounded-full"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  color="primary"
                  className="min-w-[7rem] rounded-full"
                  loading={isLoading}
                >
                  Guardar
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
