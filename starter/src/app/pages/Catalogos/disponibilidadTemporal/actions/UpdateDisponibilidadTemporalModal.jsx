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
import {
  updateDisponibilidad,
  getAllProfesionales,
  getAllConsultorios,
} from "../api/disponibilidadTemporalList.api";
import { toast } from "sonner";

export function UpdateDisponibilidadTemporal({
  isOpen,
  onClose,
  onUpdate,
  disponibilidad,
}) {
  const [formData, setFormData] = useState({
    profesional_salud: null,
    consultorio: null,
    fecha_inicio: "",
    fecha_fin: "",
    hora_inicio: "",
    hora_fin: "",
    dias_semana: [],
    activo: true,
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
    { value: 7, label: "Domingo" },
  ];

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          setIsLoading(true);
          
          const [profesionalesRes, consultoriosRes] = await Promise.all([
            getAllProfesionales(),
            getAllConsultorios(),
          ]);

          setProfesionales(
            profesionalesRes.data.map((p) => ({
              label: p.nombre,
              value: p.id,
            }))
          );

          setConsultorios(
            consultoriosRes.data.map((c) => ({
              label: c.nombre,
              value: c.id,
            }))
          );

          if (disponibilidad) {
            // Formatear las horas de "HH:MM:SS" a "HH:MM"
            const formatTime = (timeString) => {
              if (!timeString) return "";
              return timeString.slice(0, 5);
            };

            // Asegurarse de que los dias_semana sean números
            let diasSemanaFormateados = [];
            if (Array.isArray(disponibilidad.dias_semana)) {
              diasSemanaFormateados = disponibilidad.dias_semana.map(day => typeof day === 'string' ? parseInt(day, 10) : day);
            } else if (typeof disponibilidad.dias_semana === 'string') {
              try {
                const parsedDias = JSON.parse(disponibilidad.dias_semana);
                diasSemanaFormateados = Array.isArray(parsedDias) 
                  ? parsedDias.map(day => typeof day === 'string' ? parseInt(day, 10) : day)
                  : [];
              } catch (err) {
                console.error("Error al parsear dias_semana:", err);
                diasSemanaFormateados = [];
              }
            }

            setFormData({
              profesional_salud: disponibilidad.profesional_salud,
              consultorio: disponibilidad.consultorio,
              fecha_inicio: disponibilidad.fecha_inicio || "",
              fecha_fin: disponibilidad.fecha_fin || "",
              hora_inicio: formatTime(disponibilidad.hora_inicio),
              hora_fin: formatTime(disponibilidad.hora_fin),
              dias_semana: diasSemanaFormateados,
              activo: disponibilidad.activo ?? true,
            });
          }
        } catch (err) {
          console.error("Error cargando datos:", err);
          setError("Error al cargar los datos");
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }
  }, [isOpen, disponibilidad]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseInt(value, 10) : null,
    }));
    setError(null);
  };

  const handleDateChange = (name) => (date) => {
    const formatted = date ? new Date(date).toISOString().split("T")[0] : "";
    setFormData((prev) => ({ ...prev, [name]: formatted }));
    setError(null);
  };


  const handleSubmit = async () => {
    console.log("Estado actual antes de validar:", formData);
    
    const requiredFields = [
      { name: 'profesional_salud', label: 'Profesional' },
      { name: 'consultorio', label: 'Consultorio' },
      { name: 'dias_semana', label: 'Días' },
      { name: 'fecha_inicio', label: 'Fecha inicio'},
      { name: 'fecha_fin', label: 'Fecha fin'},
      { name: 'hora_inicio', label: 'Hora inicio' },
      { name: 'hora_fin', label: 'Hora fin' }
    ];

    const missingFields = requiredFields.filter(field => {
      const value = formData[field.name];
      const isEmpty = value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
      console.log(`Validando campo ${field.name}: ${value}, está vacío: ${isEmpty}`);
      return isEmpty;
    });

    if (missingFields.length > 0) {
      setError(`Faltan campos requeridos: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    if (formData.hora_inicio >= formData.hora_fin) {
      setError("La hora de fin debe ser posterior a la hora de inicio");
      return;
    }

    try {
      setIsLoading(true);
      
      // Asegurarnos de que los días de la semana sean números
      const diasSemanaFormatted = formData.dias_semana.map(dia => 
        typeof dia === 'string' ? parseInt(dia, 10) : dia
      );

      // Asegurar que las horas tengan el formato correcto (HH:MM:SS)
      const formatTimeForAPI = (timeString) => {
        if (!timeString) return "";
        
        const parts = timeString.split(':');
        // Si solo tiene HH:MM, añadir :00 para segundos
        if (parts.length === 2) {
          return `${timeString}:00`;
        }
        return timeString;
      };

      const payload = {
        profesional_salud: formData.profesional_salud,
        consultorio: formData.consultorio,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        hora_inicio: formatTimeForAPI(formData.hora_inicio),
        hora_fin: formatTimeForAPI(formData.hora_fin),
        dias_semana: diasSemanaFormatted,
        activo: formData.activo,
      };

      console.log("Enviando payload:", payload);

      const res = await updateDisponibilidad(disponibilidad.id, payload);
      
      // Formateamos los datos para actualizar la UI
      const updatedData = {
        ...res.data,
        // Asegurarnos de que la UI reciba los datos necesarios para mostrar
        profesional_salud_nombre: disponibilidad.profesional_salud_nombre,
        consultorio_nombre: disponibilidad.consultorio_nombre
      };
      
      onUpdate(updatedData);
      toast.success("Disponibilidad actualizada correctamente");
      onClose();
    } catch (err) {
      console.error("Error al actualizar:", err);
      if (err.response && err.response.data) {
        console.error("Detalles del error:", err.response.data);
        setError(`Error en la actualización: ${JSON.stringify(err.response.data)}`);
      } else {
        toast.error("Error al actualizar la disponibilidad.");
        setError("Error en la actualización");
      }
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
                Editar Disponibilidad Temporal
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

                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    label="Fecha Inicio"
                    value={formData.fecha_inicio}
                    onChange={handleDateChange("fecha_inicio")}
                    options={{ 
                      dateFormat: 'Y-m-d',
                      defaultDate: formData.fecha_inicio || null
                    }}
                    placeholder="Seleccione una fecha"
                    required
                  />

                  <DatePicker
                    label="Fecha Fin"
                    value={formData.fecha_fin}
                    onChange={handleDateChange("fecha_fin")}
                    options={{ 
                      dateFormat: 'Y-m-d',
                      defaultDate: formData.fecha_fin || null
                    }}
                    placeholder="Seleccione una fecha"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">
                      Hora Inicio *
                    </label>
                    <input
                      type="time"
                      name="hora_inicio"
                      value={formData.hora_inicio || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        console.log("Hora inicio input changed:", value);
                        setFormData(prev => ({...prev, hora_inicio: value}));
                        setError(null);
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-800 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-750 dark:text-dark-100 dark:focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">
                      Hora Fin *
                    </label>
                    <input
                      type="time"
                      name="hora_fin"
                      value={formData.hora_fin || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        console.log("Hora fin input changed:", value);
                        setFormData(prev => ({...prev, hora_fin: value}));
                        setError(null);
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-800 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-750 dark:text-dark-100 dark:focus:border-primary-500"
                      required
                    />
                  </div>
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
                            setFormData((prev) => {
                              const nuevosDias = isChecked
                                ? [...prev.dias_semana, dia.value]
                                : prev.dias_semana.filter((d) => d !== dia.value);
                              return { ...prev, dias_semana: nuevosDias };
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
                  onChange={handleChange}
                  name="activo"
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
                  Actualizar
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}