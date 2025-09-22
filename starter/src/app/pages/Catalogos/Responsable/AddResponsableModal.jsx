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
import { toast } from "sonner";
import PropTypes from "prop-types";
import { createResponsable } from "./api/responsable.api"; 

export function AddResponsableModal({ atletaId, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    parentesco: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.parentesco.trim())
      newErrors.parentesco = "El parentesco es requerido";
    if (!formData.telefono.trim())
      newErrors.telefono = "El teléfono es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const newResponsable = await createResponsable(atletaId, {
        nombre: formData.nombre.trim(),
        parentesco: formData.parentesco.trim(),
        telefono: formData.telefono.trim(),
      });

      toast.success("Responsable creado exitosamente");
      onSuccess(newResponsable);
      setFormData({
        nombre: "",
        parentesco: "",
        telefono: "",
      });
      onClose();
    } catch (error) {
      console.error("Error al crear responsable:", error);

      // Manejar errores específicos del backend
      if (error.response?.data) {
        const backendErrors = error.response.data;

        // Mapear errores del backend a los campos del formulario
        const fieldErrors = {};
        if (backendErrors.nombre)
          fieldErrors.nombre = backendErrors.nombre.join(" ");
        if (backendErrors.parentesco)
          fieldErrors.parentesco = backendErrors.parentesco.join(" ");
        if (backendErrors.telefono)
          fieldErrors.telefono = backendErrors.telefono.join(" ");

        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
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
                Nuevo Responsable
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nombre completo"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={errors.nombre}
                  required
                  disabled={loading}
                />

                <Input
                  label="Parentesco"
                  name="parentesco"
                  value={formData.parentesco}
                  onChange={handleChange}
                  error={errors.parentesco}
                  required
                  disabled={loading}
                />

                <Input
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  error={errors.telefono}
                  required
                  disabled={loading}
                  type="tel"
                />

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    onClick={onClose}
                    variant="outlined"
                    className="min-w-[7rem] rounded-full"
                    disabled={loading}
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    isLoading={loading}
                    variant="solid"
                    className="min-w-[7rem] rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Guardar
                  </Button>
                </div>
              </form>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

AddResponsableModal.propTypes = {
  atletaId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};