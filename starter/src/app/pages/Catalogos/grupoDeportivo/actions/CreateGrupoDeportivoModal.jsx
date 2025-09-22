import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input, Textarea } from "components/ui";
import { createGrupoDeportivo } from "../api/grupoDeportivo.api";
import { toast } from "sonner";

export function CreateGrupoDeportivoModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      toast.error("El nombre es requerido");
      return;
    }

    try {
      setIsLoading(true);
      const response = await createGrupoDeportivo({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null
      });
      
      onCreate(response.data);
      onClose();
      toast.success("Grupo deportivo creado correctamente");
      setFormData({ nombre: "", descripcion: "" });
    } catch (err) {
      console.error("Error al crear grupo deportivo:", err);
      setError(err.response?.data?.message || "Error al crear grupo deportivo");
      toast.error("Error al crear grupo deportivo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ nombre: "", descripcion: "" });
    setError(null);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        onClose={handleClose}
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
                Nuevo Grupo Deportivo
              </DialogTitle>
              <Button
                onClick={handleClose}
                variant="flat"
                isIcon
                className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
              >
                <XMarkIcon className="size-4.5" />
              </Button>
            </div>

            <div className="flex flex-col overflow-y-auto px-4 py-4 sm:px-5">
              <div className="space-y-4">
                <Input
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese el nombre del grupo deportivo"
                />
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-200">
                    Descripción
                  </label>
                  <Textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Ingrese una descripción del grupo deportivo (opcional)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-600 dark:text-dark-100 dark:focus:border-primary-400"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 text-sm text-error dark:text-error-light">
                  {error}
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  onClick={handleClose}
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