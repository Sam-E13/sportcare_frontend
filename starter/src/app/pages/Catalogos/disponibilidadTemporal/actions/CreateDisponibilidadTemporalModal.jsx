import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Select, Checkbox } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { createDisponibilidad, getAllProfesionales, getAllConsultorios } from "../api/disponibilidadTemporalList.api";
import { toast } from "sonner";

export function CreateDisponibilidadTemporal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    profesional_salud_id: "", // Cambiado de profesional_salud a profesional
    consultorio_id: "",
    fecha_inicio: "",
    fecha_fin: "",
    hora_inicio: "09:00",
    hora_fin: "17:00",
    dias_semana: [],
    activo: true
  });

  const [profesionales, setProfesionales] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const diasSemana = [
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
    { value: 7, label: "Domingo" }
  ];

  useEffect(() => {
    if (isOpen) {
      setFormData({
        profesional_salud_id: "",
        consultorio_id: "",
        fecha_inicio: "",
        fecha_fin: "",
        hora_inicio: "09:00",
        hora_fin: "17:00",
        dias_semana: [],
        activo: true
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

  const handleDateChange = (name) => (date) => {
    // Asegurar que la fecha esté en formato YYYY-MM-DD
    const formattedDate = date ? new Date(date).toISOString().split('T')[0] : "";
    setFormData(prev => ({ ...prev, [name]: formattedDate }));
    setError(null);
  };

  const handleTimeChange = (name) => (time) => {
    // Asegurar que la hora esté en formato HH:MM
    const formattedTime = time ? time.format('HH:mm') : "";
    setFormData(prev => ({ ...prev, [name]: formattedTime }));
    setError(null);
  };

  const handleSubmit = async () => {
    const requiredFields = [
      { name: 'profesional_salud_id', label: 'Profesional' },
      { name: 'consultorio_id', label: 'Consultorio' },
      { name: 'fecha_inicio', label: 'Fecha inicio' },
      { name: 'fecha_fin', label: 'Fecha fin' },
      { name: 'hora_inicio', label: 'Hora inicio' },
      { name: 'hora_fin', label: 'Hora fin' },
      { name: 'dias_semana', label: 'Días de la semana' }
    ];

    const missingFields = requiredFields.filter(field => {
      const value = formData[field.name];
      return value === null || value === undefined ||
        (Array.isArray(value) && value.length === 0) ||
        value === "";
    });

    if (missingFields.length > 0) {
      setError(`Faltan campos requeridos: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    if (new Date(formData.fecha_inicio) > new Date(formData.fecha_fin)) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    if (formData.dias_semana.length === 0) {
      setError("Debe seleccionar al menos un día de la semana");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        profesional_salud: formData.profesional_salud_id,
        consultorio: formData.consultorio_id,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        dias_semana: formData.dias_semana,
        activo: formData.activo
      };

      const response = await createDisponibilidad(payload);
      onCreate(response.data);
      onClose();
      toast.success("Horario Temporal creado correctamente");
    } catch (err) {
      console.error("Error al crear Horario Temporal:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error al crear Horario Temporal");
      toast.error("OOPS! Ocurrió un error al crear Horario Temporal");
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
                Nueva Horario Temporal
              </DialogTitle>
              <Button
                onClick={onClose}
                variant="flat"
                isIcon={true}
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
                <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  label="Fecha Inicio"
                  value={formData.fecha_inicio}
                  onChange={handleDateChange('fecha_inicio')}
                  options={{ dateFormat: 'Y-m-d' , altImput: true, altFormat: 'd/m/Y'}}
                  placeholder="Seleccione una fecha"
                  required
                />

                <DatePicker
                  label="Fecha Fin"
                  value={formData.fecha_fin}
                  onChange={handleDateChange('fecha_fin')}
                  options={{ dateFormat: 'Y-m-d' , altImput: true, altFormat: 'd/m/Y'}}
                  placeholder="Seleccione una fecha"
                  required
                />
                </div>
                <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  label="Hora Inicio"
                  value={formData.hora_inicio}
                  onChange={handleTimeChange('hora_inicio')}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'H:i',
                    time_24hr: true,
                    defaultHour: 17,
                    defaultMinute: 0
                  }}
                  required
                />

                <DatePicker
                  label="Hora Fin"
                  value={formData.hora_fin}
                  onChange={handleTimeChange('hora_fin')}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'H:i',
                    time_24hr: true,
                    defaultHour: 17,
                    defaultMinute: 0
                  }}
                  required
                />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300">
                    Días de la semana *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {diasSemana.map((dia) => (
                      <div key={dia.value} className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.dias_semana.includes(dia.value)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData(prev => {
                              const newDias = isChecked
                                ? [...prev.dias_semana, dia.value]
                                : prev.dias_semana.filter(d => d !== dia.value);
                              return { ...prev, dias_semana: newDias };
                            });
                          }}
                        />
                        <span className="text-sm text-gray-700 dark:text-dark-300">
                          {dia.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Checkbox
                  checked={formData.activo}
                  onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                  label="Activo"
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