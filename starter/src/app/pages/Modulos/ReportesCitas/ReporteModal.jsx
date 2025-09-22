import { Fragment, useState, useEffect } from "react";
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

// Usar una variable de entorno o configuración para la URL base
const API_GENERAR_REPORTE_PDF = "http://localhost:8001/Citas/api/generar-reporte-pdf/";

const ReporteModal = ({ 
  showModal, 
  setShowModal, 
  filtrosOptions, 
  filtrosLoading 
}) => {
  const [formErrors, setFormErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    atleta_id: null,
    area_id: null,
    consultorio_id: null,
    profesional_id: null,
    fecha_inicio: '',
    fecha_fin: ''
  });

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (showModal) {
      setFormData({
        atleta_id: null,
        area_id: null,
        consultorio_id: null,
        profesional_id: null,
        fecha_inicio: '',
        fecha_fin: ''
      });
      setFormErrors({});
    }
  }, [showModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? null : value
    }));
    
    // Limpiar error del campo cuando se modifica
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateDates = () => {
    const errors = {};
    if (!formData.fecha_inicio) {
      errors.fecha_inicio = "Fecha inicio es requerida";
    }
    if (!formData.fecha_fin) {
      errors.fecha_fin = "Fecha fin es requerida";
    }
    
    if (formData.fecha_inicio && formData.fecha_fin) {
      const inicio = new Date(formData.fecha_inicio);
      const fin = new Date(formData.fecha_fin);
      
      if (inicio > fin) {
        errors.fecha_fin = "La fecha fin debe ser posterior a la fecha inicio";
      }
    }
    
    return errors;
  };

  const handleGenerarReporte = async () => {
    try {
      // Validación de fechas
      const errors = validateDates();
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setFormErrors({});
      setIsGenerating(true);
      
      // Mostrar toast de carga
      const loadingToast = toast.loading("Generando reporte PDF...");

      // Preparar payload para el backend
      const payload = {
        ...formData,
        // Asegurar que los IDs sean números o null
        atleta_id: formData.atleta_id ? Number(formData.atleta_id) : null,
        area_id: formData.area_id ? Number(formData.area_id) : null,
        consultorio_id: formData.consultorio_id ? Number(formData.consultorio_id) : null,
        profesional_id: formData.profesional_id ? Number(formData.profesional_id) : null
      };

      const response = await fetch(API_GENERAR_REPORTE_PDF, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Descartar el toast de carga
      toast.dismiss(loadingToast);

      if (!response.ok) {
        let errorMessage = "Error al generar el reporte";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.detail || `Error ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Descargar el PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-citas-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Reporte generado correctamente");
      setShowModal(false);
    } catch (error) {
      console.error("Error al generar reporte PDF:", error);
      toast.error(error.message || "Error al generar el reporte");
    } finally {
      setIsGenerating(false);
    }
  };

  // Función para renderizar un select con opciones
  const renderSelect = (name, label, options, disabled = false) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">
          {label}
        </label>
        <select 
          name={name}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white dark:bg-dark-800 text-gray-800 dark:text-dark-100 dark:border-dark-500"
          onChange={handleInputChange}
          value={formData[name] || ""}
          disabled={disabled || isGenerating}
        >
          <option value="">Todos</option>
          {options.filter(item => item.id !== "todos").map(item => (
            <option key={item.id} value={item.id}>
              {item.nombre}
            </option>
          ))}
        </select>
        {formErrors[name] && (
          <p className="mt-1 text-sm text-error dark:text-error-light">
            {formErrors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        onClose={() => !isGenerating && setShowModal(false)}
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
                Configuración del Reporte PDF
              </DialogTitle>
              <Button
                onClick={() => !isGenerating && setShowModal(false)}
                variant="flat"
                isIcon
                className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                disabled={isGenerating}
              >
                <XMarkIcon className="size-4.5" />
              </Button>
            </div>

            <div className="flex flex-col overflow-y-auto px-4 py-4 sm:px-5">
              {filtrosLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="inline-block animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                  <p className="ml-3 text-sm text-gray-600 dark:text-dark-300">Cargando opciones...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSelect("atleta_id", "Atleta", filtrosOptions.atletas || [])}
                    {renderSelect("area_id", "Área", filtrosOptions.areas || [])}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSelect("consultorio_id", "Consultorio", filtrosOptions.consultorios || [])}
                    {renderSelect("profesional_id", "Profesional", filtrosOptions.profesionales || [])}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">
                        Fecha Inicio *
                      </label>
                      <Input
                        type="date"
                        name="fecha_inicio"
                        value={formData.fecha_inicio}
                        onChange={handleInputChange}
                        required
                        disabled={isGenerating}
                        error={formErrors.fecha_inicio}
                      />
                      {formErrors.fecha_inicio && (
                        <p className="mt-1 text-sm text-error dark:text-error-light">
                          {formErrors.fecha_inicio}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">
                        Fecha Fin *
                      </label>
                      <Input
                        type="date"
                        name="fecha_fin"
                        value={formData.fecha_fin}
                        onChange={handleInputChange}
                        required
                        disabled={isGenerating}
                        error={formErrors.fecha_fin}
                      />
                      {formErrors.fecha_fin && (
                        <p className="mt-1 text-sm text-error dark:text-error-light">
                          {formErrors.fecha_fin}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  onClick={() => !isGenerating && setShowModal(false)}
                  variant="outlined"
                  className="min-w-[7rem] rounded-full"
                  disabled={isGenerating}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleGenerarReporte}
                  color="primary"
                  className="min-w-[7rem] rounded-full"
                  loading={isGenerating}
                >
                  Generar PDF
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default ReporteModal;