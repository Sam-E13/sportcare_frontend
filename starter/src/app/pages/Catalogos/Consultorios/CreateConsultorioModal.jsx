import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon, MapPinIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import { Button, Input } from "components/ui";

export function CreateConsultorioModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    nombre: '',
    calle: '',
    numero: '',
    colonia: '',
    cp: '',
    ciudad: '',
    estado: '',
    pais: 'México'
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
      return;
    }

    try {
      setIsLoading(true);
      const result = await onCreate(formData);
      
      if (result && !result.success) {
        setError(result.error || "Ocurrió un error al crear el consultorio");
        return;
      }

      onClose();
      setFormData({
        nombre: '',
        calle: '',
        numero: '',
        colonia: '',
        cp: '',
        ciudad: '',
        estado: '',
        pais: 'México'
      });
    } catch (err) {
      console.error("Error:", err);
      setError("Ocurrió un error inesperado");
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
          <DialogPanel className="relative flex w-full max-w-2xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-dark-700">
            <div className="flex items-center justify-between rounded-t-lg bg-gray-200 px-4 py-3 dark:bg-dark-800 sm:px-5">
              <DialogTitle
                as="h3"
                className="text-base font-medium text-gray-800 dark:text-dark-100"
              >
                Nuevo Consultorio
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
                <div>
                  <Input
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center font-semibold mb-2">
                    <MapPinIcon className="mr-2 size-5 text-gray-500" />
                    <span>Dirección</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Calle"
                      name="calle"
                      value={formData.calle}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Número"
                      name="numero"
                      value={formData.numero}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Colonia"
                      name="colonia"
                      value={formData.colonia}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Código Postal"
                      name="cp"
                      value={formData.cp}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <div className="font-semibold mb-2">Ubicación</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="País"
                      name="pais"
                      value={formData.pais}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 text-error dark:text-error-light">
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

CreateConsultorioModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
};