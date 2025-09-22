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
import { updateDeporte, getAllGruposDeportivos } from "../api/deporteList.api";
import { toast } from "sonner";

export function DeporteUpdateModal({ isOpen, onClose, row, onUpdate }) {
  const deporte = row?.original || {};
  const [formData, setFormData] = useState({
    nombre: deporte.nombre || "",
    grupo: deporte.grupo || "", // ID del grupo
  });

  const [gruposOptions, setGruposOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGrupos, setIsLoadingGrupos] = useState(false);
  const [error, setError] = useState(null);

  // Cargar grupos deportivos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const loadGrupos = async () => {
        try {
          setIsLoadingGrupos(true);
          const response = await getAllGruposDeportivos();
          const options = [
            { value: "", label: "Seleccione un grupo deportivo", disabled: true },
            ...response.data.map(grupo => ({
              value: grupo.id,
              label: grupo.nombre,
              disabled: false
            }))
          ];
          setGruposOptions(options);
        } catch (err) {
          console.error("Error cargando grupos deportivos:", err);
          toast.error("Error al cargar los grupos deportivos");
        } finally {
          setIsLoadingGrupos(false);
        }
      };
      loadGrupos();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      toast.error("El nombre del deporte es requerido");
      return;
    }
    
    if (!formData.grupo) {
      setError("Seleccione un grupo deportivo");
      toast.error("Debe seleccionar un grupo deportivo");
      return;
    }

    try {
      setIsLoading(true);
      const updatedData = {
        nombre: formData.nombre,
        grupo: formData.grupo
      };
      
      await updateDeporte(deporte.id, updatedData);
      onUpdate(deporte.id, updatedData);
      onClose();
      toast.success(`Deporte "${formData.nombre}" actualizado correctamente`);
    } catch (error) {
      console.error("Error al actualizar deporte:", error);
      setError(error.response?.data?.message || "Error al actualizar el deporte");
      toast.error(`Error al actualizar el deporte "${formData.nombre}"`);
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
                Editar Deporte
              </DialogTitle>
              <Button
                onClick={onClose}
                variant="flat"
                isIcon
                className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                disabled={isLoading}
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
                
                <Select
                  label="Grupo Deportivo"
                  name="grupo"
                  value={formData.grupo}
                  onChange={handleInputChange}
                  data={gruposOptions}
                  isLoading={isLoadingGrupos}
                  required
                />
              </div>

              {error && (
                <div className="mt-4 text-sm text-error dark:text-error-light">
                  {error}
                </div>
              )}

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
                  disabled={isLoadingGrupos}
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}