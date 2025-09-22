import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "components/ui";
import { crearCategoria, updateCategoria } from "./api/categoriaList.api";

export function CreateCategoriaModal({ isOpen, onClose, onCreate, categoriaToEdit }) {
  const [formData, setFormData] = useState({
    nombre: categoriaToEdit?.nombre || "",
    edadMin: categoriaToEdit?.edadMin || "",
    edadMax: categoriaToEdit?.edadMax || ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }
    if (!formData.edadMin || !formData.edadMax) {
      setError("Las edades son requeridas");
      return;
    }
    if (parseInt(formData.edadMin) >= parseInt(formData.edadMax)) {
      setError("La edad mínima debe ser menor que la máxima");
      return;
    }

    try {
      setIsLoading(true);
      const categoriaData = {
        nombre: formData.nombre,
        edadMin: parseInt(formData.edadMin),
        edadMax: parseInt(formData.edadMax)
      };

      if (categoriaToEdit) {
        // Modo edición
        const response = await updateCategoria(categoriaToEdit.id, categoriaData);
        onCreate(response.data, true);
      } else {
        // Modo creación
        const response = await crearCategoria(categoriaData);
        onCreate(response.data, false);
      }
      
      onClose();
      setFormData({ nombre: "", edadMin: "", edadMax: "" });
    } catch (err) {
      console.error("Error al guardar categoría:", err);
      setError("Error al guardar la categoría");
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
                {categoriaToEdit ? "Editar Categoría" : "Nueva Categoría"}
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
              <div className="space-y-4">
                <Input
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Edad Mínima"
                    name="edadMin"
                    type="number"
                    value={formData.edadMin}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                  
                  <Input
                    label="Edad Máxima"
                    name="edadMax"
                    type="number"
                    value={formData.edadMax}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <div className="mt-4 px-4 text-error dark:text-error-light">
                  {error}
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
                  onClick={handleSubmit}
                  color="primary"
                  className="min-w-[7rem] rounded-full"
                  loading={isLoading}
                >
                  {categoriaToEdit ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}