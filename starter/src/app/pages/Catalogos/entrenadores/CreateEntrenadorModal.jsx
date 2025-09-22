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
import { createEntrenador, getAllUsers, getAllDeportes } from "./api/entrenadorList.api";
import { toast } from "sonner";

export function CreateEntrenadorModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    user: "",
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
    if (isOpen) {
      setFormData({
        user: "",
        nombre: "",
        apPaterno: "",
        apMaterno: "",
        fechaNacimiento: "",
        sexo: "M",
        telefono: "",
        disciplinas: []
      });
      setError(null);

      Promise.all([
        getAllUsers(),
        getAllDeportes()
      ]).then(([usersRes, deportesRes]) => {
        setUsers([
          { value: "", label: "Seleccione un usuario", disabled: true },
          ...usersRes.data.map(u => ({
            value: u.id,
            label: `${u.username}`,
            disabled: false
          }))
        ]);

        setDeportes(deportesRes.data);
      }).catch(err => {
        console.error("Error cargando opciones:", err);
        setError("Error al cargar las opciones");
        toast.error("Error al cargar las opciones del formulario");
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
      { name: 'user', label: 'Usuario' },
      { name: 'nombre', label: 'Nombre' },
      { name: 'apPaterno', label: 'Apellido Paterno' },
      { name: 'apMaterno', label: 'Apellido Materno' },
      { name: 'fechaNacimiento', label: 'Fecha de Nacimiento' },
      { name: 'sexo', label: 'Sexo' },
      { name: 'telefono', label: 'Teléfono' }
    ];

    const missingFields = requiredFields.filter(field => {
      if (field.name === 'user') {
        return !formData[field.name] || formData[field.name] === "";
      }
      return !formData[field.name];
    });

    if (missingFields.length > 0) {
      const errorMessage = `Faltan campos requeridos: ${missingFields.map(f => f.label).join(', ')}`;
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    try {
      setIsLoading(true);
      const loadingToast = toast.loading('Creando entrenador...');

      const response = await createEntrenador({
        user: formData.user,
        nombre: formData.nombre,
        apPaterno: formData.apPaterno,
        apMaterno: formData.apMaterno,
        fechaNacimiento: formData.fechaNacimiento,
        sexo: formData.sexo,
        telefono: formData.telefono,
        disciplinas: formData.disciplinas
      });
      
      toast.dismiss(loadingToast);
      toast.success('Entrenador creado exitosamente');
      
      onCreate(response.data);
      onClose();

    } catch (err) {
      console.error("Error al crear entrenador:", err.response?.data || err.message);
      
      let errorMessage = "Error al crear el entrenador";
      
      if (err.response?.status === 500 && 
          (err.response?.data?.includes("user_id") || 
           err.response?.data?.includes("duplicate key"))) {
        errorMessage = "Error: El usuario ya ha sido asignado a otro entrenador. Por favor seleccione otro usuario.";
      } else {
        errorMessage = err.response?.data?.message || 
                     err.response?.data?.detail || 
                     errorMessage;
      }
      
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 6000,
        action: {
          label: "Entendido",
          onClick: () => {}
        }
      });
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
                Nuevo Entrenador
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
                  name="user"
                  value={formData.user}
                  onChange={handleSelectChange}
                  data={users}
                  required
                />

                <Input
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Apellido Paterno"
                  name="apPaterno"
                  value={formData.apPaterno}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Apellido Materno"
                  name="apMaterno"
                  value={formData.apMaterno}
                  onChange={handleInputChange}
                />

                <Input
                  label="Fecha de Nacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  required
                />

                <Select
                  label="Sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleSelectChange}
                  data={sexoOptions}
                  required
                />

                <Input
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
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
                          checked={formData.disciplinas.includes(deporte.id)}
                          onChange={() => handleDisciplinaChange(deporte.id)}
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
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  color="primary"
                  className="min-w-[7rem] rounded-full"
                  loading={isLoading ? "true" : undefined}
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