import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input, Select, Checkbox } from "components/ui";
import { 
  updateEntrenador,
  getAllUsers,
  getAllDeportes 
} from "./api/entrenadorList.api";
import { toast } from "sonner";

export function UpdateEntrenadorModal({ isOpen, onClose, entrenador, onUpdate }) {
  const [formData, setFormData] = useState({
    user_id: "",
    nombre: "",
    apPaterno: "",
    apMaterno: "",
    fechaNacimiento: "",
    sexo: "M",
    telefono: "",
    disciplinas: []
  });

  const [users, setUsers] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sexoOptions = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Femenino" }
  ];

  useEffect(() => {
    if (isOpen && entrenador) {
      const loadData = async () => {
        try {
          setIsLoading(true);
          const loadingToast = toast.loading('Cargando datos del entrenador...');
          const [usersRes, deportesRes] = await Promise.all([
            getAllUsers(),
            getAllDeportes()
          ]);

          setUsers([
            { value: "", label: "Seleccione un usuario", disabled: true },
            ...usersRes.data.map(u => ({
              value: String(u.id),
              label: u.username || `Usuario ${u.id}`,
              disabled: false
            }))
          ]);

          setDeportes(deportesRes.data);

          // Manejo de disciplinas seleccionadas
          const disciplinasSeleccionadas = entrenador.disciplinas
            ? Array.isArray(entrenador.disciplinas)
              ? entrenador.disciplinas.map(d => String(d.id || d))
              : typeof entrenador.disciplinas === 'object'
                ? [String(entrenador.disciplinas.id)]
                : [String(entrenador.disciplinas)]
            : [];

          setFormData({
            user_id: entrenador.user ? String(entrenador.user.id || entrenador.user) : entrenador.user_id ? String(entrenador.user_id) : "",
            nombre: entrenador.nombre || "",
            apPaterno: entrenador.apPaterno || "",
            apMaterno: entrenador.apMaterno || "",
            fechaNacimiento: entrenador.fechaNacimiento?.split('T')[0] || "",
            sexo: entrenador.sexo || "M",
            telefono: entrenador.telefono || "",
            disciplinas: disciplinasSeleccionadas
          });

          toast.dismiss(loadingToast);
        } catch (err) {
          console.error("Error cargando opciones:", err);
          setError("Error al cargar los datos necesarios");
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }
  }, [isOpen, entrenador]);

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

  const handleDisciplinaChange = (deporteId) => {
    setFormData(prev => {
      const newDisciplinas = prev.disciplinas.includes(deporteId)
        ? prev.disciplinas.filter(id => id !== deporteId)
        : [...prev.disciplinas, deporteId];
      return { ...prev, disciplinas: newDisciplinas };
    });
  };

  const handleSubmit = async () => {
    const requiredFields = [
      { name: 'nombre', label: 'Nombre' },
      { name: 'apPaterno', label: 'Apellido Paterno' },
      { name: 'fechaNacimiento', label: 'Fecha de Nacimiento' },
      { name: 'sexo', label: 'Sexo' },
      { name: 'telefono', label: 'Teléfono' }
    ];
  
    const missingFields = requiredFields.filter(field => !formData[field.name]);
    if (missingFields.length > 0) {
      const errorMessage = `Faltan campos requeridos: ${missingFields.map(f => f.label).join(', ')}`;
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
  
    try {
      setIsLoading(true);
      const loadingToast = toast.loading('Actualizando entrenador...');
      
      const payload = {
        nombre: formData.nombre,
        apPaterno: formData.apPaterno,
        apMaterno: formData.apMaterno,
        fechaNacimiento: formData.fechaNacimiento,
        sexo: formData.sexo,
        telefono: formData.telefono,
        user: formData.user_id ? Number(formData.user_id) : null,
        disciplinas: formData.disciplinas.map(id => Number(id))
      };

      const response = await updateEntrenador(entrenador.id, payload);
      
      // Crear objeto actualizado con los nombres de disciplinas
      const updatedEntrenador = {
        ...response.data,
        disciplinas: formData.disciplinas.map(id => Number(id)),
        disciplinas_display: deportes
          .filter(d => formData.disciplinas.includes(String(d.id)))
          .map(d => d.nombre)
          .join(', ') || "No especificado"
      };

      toast.dismiss(loadingToast);
      toast.success('Entrenador actualizado correctamente');

      onUpdate(updatedEntrenador);
      onClose();
    } catch (err) {
      console.error("Error al actualizar entrenador:", err);
      
      let errorMessage = "Error al actualizar el entrenador";
      if (err.response) {
        if (err.response.data?.errors) {
          errorMessage = Object.values(err.response.data.errors).flat().join(', ');
        } else {
          errorMessage = err.response.data?.detail || 
                       err.response.data?.message || 
                       errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
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
                Editar Entrenador
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
                  label="Usuario"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleSelectChange}
                  data={users}
                  disabled={isLoading}
                />

                <Input
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Apellido Paterno"
                  name="apPaterno"
                  value={formData.apPaterno}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Apellido Materno"
                  name="apMaterno"
                  value={formData.apMaterno}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />

                <Input
                  label="Fecha de Nacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />

                <Select
                  label="Sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleSelectChange}
                  data={sexoOptions}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-100 mb-2">
                    Disciplinas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {deportes.map(deporte => (
                      <div key={deporte.id} className="flex items-center">
                        <Checkbox
                          id={`deporte-${deporte.id}`}
                          checked={formData.disciplinas?.includes(String(deporte.id))}
                          onChange={() => handleDisciplinaChange(String(deporte.id))}
                          disabled={isLoading}
                        />
                        <label htmlFor={`deporte-${deporte.id}`} className="ml-2 text-sm">
                          {deporte.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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
                >
                  Guardar cambios
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}