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

// URL para generar el reporte PDF de consultas
const API_GENERAR_REPORTE_CONSULTAS_PDF = "http://localhost:8002/Consultas/generar-reporte-consultas/";

const ReporteConsultaModal = ({ 
  showModal, 
  setShowModal, 
  filtrosOptions, 
  filtrosLoading 
}) => {
  const [formErrors, setFormErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    atleta_id: null,
    profesional_id: null,
    fecha_inicio: '',
    fecha_fin: ''
  });

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (showModal) {
      setFormData({
        atleta_id: null,
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
      const loadingToast = toast.loading("Generando reporte de consultas...");

      // Preparar payload para el backend
      const payload = {
        ...formData,
        // Asegurar que los IDs sean números o null
        atleta_id: formData.atleta_id ? Number(formData.atleta_id) : null,
        profesional_id: formData.profesional_id ? Number(formData.profesional_id) : null
      };

      const response = await fetch(API_GENERAR_REPORTE_CONSULTAS_PDF, {
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
      a.download = `reporte-consultas-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Reporte de consultas generado correctamente");
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
          <DialogPanel className="relative w-full max-w-lg rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all dark:bg-dark-700 sm:p-5">
            <div className="flex items-center justify-between">
              <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-100">
                Generar Reporte de Consultas
              </DialogTitle>
              <button
                onClick={() => !isGenerating && setShowModal(false)}
                className="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-gray-200/50 focus:bg-gray-200/50 active:bg-gray-200/50 dark:hover:bg-dark-300/20 dark:focus:bg-dark-300/20 dark:active:bg-dark-300/20"
                disabled={isGenerating}
              >
                <XMarkIcon className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Fecha Inicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">
                    Fecha Inicio
                  </label>
                  <Input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleInputChange}
                    disabled={isGenerating}
                    error={formErrors.fecha_inicio}
                  />
                </div>

                {/* Fecha Fin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">
                    Fecha Fin
                  </label>
                  <Input
                    type="date"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleInputChange}
                    disabled={isGenerating}
                    error={formErrors.fecha_fin}
                  />
                </div>
              </div>

              {/* Filtros adicionales */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Atleta */}
                {renderSelect(
                  "atleta_id",
                  "Atleta",
                  filtrosLoading ? [] : (filtrosOptions?.atletas || []),
                  filtrosLoading || isGenerating
                )}

                {/* Profesional de Salud */}
                {renderSelect(
                  "profesional_id",
                  "Profesional de Salud",
                  filtrosLoading ? [] : (filtrosOptions?.profesionales || []),
                  filtrosLoading || isGenerating
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-2 pt-4">
              <Button
                color="secondary"
                onClick={() => setShowModal(false)}
                disabled={isGenerating}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={handleGenerarReporte}
                loading={isGenerating}
                disabled={isGenerating}
              >
                Generar Reporte
              </Button>
            </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default ReporteConsultaModal;