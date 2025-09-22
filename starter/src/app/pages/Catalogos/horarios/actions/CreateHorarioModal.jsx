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
import { createHorario, getAllProfesionales, getAllConsultorios } from "../api/horarioList.api";
import { toast } from "sonner";

export function CreateHorarioModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    profesional_salud_id: "",
    consultorio_id: "",
    dia: "",
    hora_inicio: "",
    hora_fin: "",
    duracion_cita: 30
  });

  const [profesionales, setProfesionales] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const diasSemana = [
    { value: "", label: "Seleccione un día", disabled: true },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 7, label: 'Domingo' }
  ];

  useEffect(() => {
    if (isOpen) {
      setFormData({
        profesional_salud_id: "",
        consultorio_id: "",
        dia: "",
        hora_inicio: "",
        hora_fin: "",
        duracion_cita: 30
      });
      setError(null);

      Promise.all([
        getAllProfesionales(),
        getAllConsultorios()
      ]).then(([profesionalesRes, consultoriosRes]) => {
        setProfesionales([
          { value: "", label: "Seleccione un profesional", disabled: true },
          ...profesionalesRes.data.map(p => ({
            label: p.nombre,
            value: p.id,
            disabled: false
          }))
        ]);
        setConsultorios([
          { value: "", label: "Seleccione un consultorio", disabled: true },
          ...consultoriosRes.data.map(c => ({
            label: c.nombre,
            value: c.id,
            disabled: false
          }))
        ]);
      }).catch(err => {
        console.error("Error cargando opciones:", err);
        setError("Error al cargar las opciones");
      });
    }
  }, [isOpen]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    const requiredFields = [
      { name: 'profesional_salud_id', label: 'Profesional' },
      { name: 'consultorio_id', label: 'Consultorio' },
      { name: 'dia', label: 'Día de la semana' },
      { name: 'hora_inicio', label: 'Hora inicio' },
      { name: 'hora_fin', label: 'Hora fin' }
    ];

    const missingFields = requiredFields.filter(field => !formData[field.name]);

    if (missingFields.length > 0) {
      setError(`Faltan campos requeridos: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    try {
      setIsLoading(true);
      // Prepara los datos con los nombres correctos que espera el backend
      const datosParaBackend = {
        profesional_salud: formData.profesional_salud_id,
        consultorio: formData.consultorio_id,
        dia: formData.dia,
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        duracion_cita: formData.duracion_cita
      };

      const response = await createHorario(datosParaBackend);
      onCreate(response.data);
      onClose();
      toast.success("Horario creado correctamente")
    } catch (err) {
      console.error("Error al crear horario:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error al crear el horario");
      toast.error(" OOPS! Ocurrió un error al crear el horario")
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
                Nuevo Horario
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
                  name="profesional_salud_id"
                  value={formData.profesional_salud_id}
                  onChange={handleSelectChange}
                  data={profesionales}
                  required
                />

                <Select
                  label="Consultorio"
                  name="consultorio_id"
                  value={formData.consultorio_id}
                  onChange={handleSelectChange}
                  data={consultorios}
                  required
                />

                <Select
                  label="Día de la semana"
                  name="dia"
                  value={formData.dia}
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
                  Crear
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}