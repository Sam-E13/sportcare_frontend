import { Fragment, useState, useEffect, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";
import { getAtletaContacto, saveAtletaContacto } from "./api/atletaList.api";

export function AtletaContactoModal({ isOpen, onClose, atleta }) {
  // Función para obtener los datos iniciales del formulario
  const getInitialFormData = useCallback(() => ({
    telefono: '',
    email: '',
    calle: '',
    noExterior: '',
    noInterior: '',
    colonia: '',
    cp: '',
    ciudad: '',
    estado: '',
    pais: 'México',
    atleta: atleta?.id || null
  }), [atleta?.id]);

  // Estados del componente
  const [formData, setFormData] = useState(getInitialFormData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Listas de opciones para selects
  const paises = [
    { value: 'México', label: 'México' },
    { value: 'Estados Unidos', label: 'Estados Unidos' },
    { value: 'Canadá', label: 'Canadá' }
  ];

  const estadosMexico = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango',
    'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
    'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
    'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora',
    'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
  ];

  // Efecto para cargar los datos del contacto
  useEffect(() => {
    if (isOpen && atleta?.id) {
      const loadContacto = async () => {
        try {
          setLoading(true);
          const response = await getAtletaContacto(atleta.id);
          
          const completeData = {
            ...getInitialFormData(),
            ...response.data,
            atleta: atleta.id
          };
          
          setFormData(completeData);
        } catch (error) {
          console.error("Error cargando contacto:", error);
          if (error.response?.status === 404) {
            setFormData({
              ...getInitialFormData(),
              atleta: atleta.id
            });
          } else {
            setError("Error al cargar la información de contacto");
            toast.error("Error al cargar el contacto");
          }
        } finally {
          setLoading(false);
        }
      };

      loadContacto();
    } else {
      // Resetear al cerrar
      setFormData(getInitialFormData());
    }
  }, [isOpen, atleta, getInitialFormData]);

  // Manejador de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  // Manejador del envío del formulario
  const handleSubmit = async () => {
    // Validación de campos requeridos
    const requiredFields = ['telefono', 'email', 'calle', 'colonia', 'cp', 'ciudad', 'estado', 'pais'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError("Por favor complete todos los campos requeridos");
      toast.error("Faltan campos requeridos");
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingrese un email válido");
      toast.error("Email inválido");
      return;
    }

    try {
      setLoading(true);
      const loadingToast = toast.loading('Guardando información de contacto...');

      await saveAtletaContacto(atleta.id, formData);
      
      toast.dismiss(loadingToast);
      toast.success('Información de contacto guardada correctamente');
      
      // Cerrar el modal y redirigir
      onClose();
      setTimeout(() => {
        navigate('/Catalogos/atleta');
      }, 500);
    } catch (error) {
      console.error("Error al guardar contacto:", error);
      setError(error.response?.data?.message || "Error al guardar el contacto");
      toast.error(error.response?.data?.message || "Error al guardar el contacto");
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
                {atleta ? `${atleta.nombre} ${atleta.apPaterno} - Contacto` : 'Contacto del Atleta'}
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
                {/* Grupo Teléfono y Email */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono || ''}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    type="tel"
                  />
                  <Input
                    label="Email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    type="email"
                  />
                </div>

                {/* Campo Calle */}
                <Input
                  label="Calle"
                  name="calle"
                  value={formData.calle || ''}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />

                {/* Grupo No. Exterior e Interior */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="No. Exterior"
                    name="noExterior"
                    value={formData.noExterior || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <Input
                    label="No. Interior"
                    name="noInterior"
                    value={formData.noInterior || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                {/* Grupo Colonia y Código Postal */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Colonia"
                    name="colonia"
                    value={formData.colonia || ''}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  <Input
                    label="Código Postal"
                    name="cp"
                    value={formData.cp || ''}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Campo Ciudad */}
                <Input
                  label="Ciudad"
                  name="ciudad"
                  value={formData.ciudad || ''}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />

                {/* Grupo Estado y País */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-100 mb-1">
                      Estado <span className="text-error">*</span>
                    </label>
                    <select
                      name="estado"
                      value={formData.estado || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 h-9"
                      disabled={loading}
                      required
                    >
                      <option value="">Seleccione un estado</option>
                      {formData.pais === 'México' && estadosMexico.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-100 mb-1">
                      País <span className="text-error">*</span>
                    </label>
                    <select
                      name="pais"
                      value={formData.pais || 'México'}
                      onChange={handleInputChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 h-9"
                      disabled={loading}
                      required
                    >
                      {paises.map(pais => (
                        <option key={pais.value} value={pais.value}>{pais.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
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
                  onClick={handleSubmit}
                  isLoading={loading}
                  variant="solid"
                  className="min-w-[7rem] rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

AtletaContactoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  atleta: PropTypes.object
};

export default AtletaContactoModal;