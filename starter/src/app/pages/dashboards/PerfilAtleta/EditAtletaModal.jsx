import { useState, useEffect } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getAllCategorias, getAllDeportes } from './api/atletaApi';
import { validateCurp } from './api/curp.api'; // Importar la API de validación de CURP

export default function EditAtletaModal({ isOpen, onClose, atletaData, onSave }) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apPaterno: '',
    apMaterno: '',
    fechaNacimiento: '',
    curp: '',
    rfc: '',
    sexo: '',
    estadoCivil: '',
    tipoSangre: '',
    categoria_id: '',
    deportes: []
  });
  
  // Listas de opciones
  const [categoriasList, setCategoriasList] = useState([]);
  const [deportesList, setDeportesList] = useState([]);
  
  // Estados de carga
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Estado para validación de CURP
  const [curpValidation, setCurpValidation] = useState({
    isValid: null,
    isLoading: false,
    data: null
  });

  // Cargar opciones disponibles
  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const [categoriasResponse, deportesResponse] = await Promise.all([
        getAllCategorias(),
        getAllDeportes()
      ]);
      setCategoriasList(categoriasResponse.data);
      setDeportesList(deportesResponse.data);
    } catch (err) {
      console.error("Error al cargar opciones:", err);
      setError("Error al cargar las opciones disponibles");
    } finally {
      setLoadingOptions(false);
    }
  };

  // Inicializar datos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchOptions();
      
      // Resetear validación de CURP
      setCurpValidation({
        isValid: null,
        isLoading: false,
        data: null
      });

      if (atletaData) {
        // Formatear fecha para input type="date"
        const formattedDate = atletaData.fechaNacimiento ? 
          new Date(atletaData.fechaNacimiento).toISOString().split('T')[0] : '';
        
        // Procesar categoría seleccionada
        let categoriaSeleccionada = '';
        if (atletaData.categorias) {
          categoriaSeleccionada = typeof atletaData.categorias === 'object' 
            ? String(atletaData.categorias.id) 
            : String(atletaData.categorias);
        }

        // Procesar deportes seleccionados
        let deportesSeleccionados = [];
        if (Array.isArray(atletaData.deportes)) {
          deportesSeleccionados = atletaData.deportes.map(d => 
            typeof d === 'object' ? String(d.id) : String(d)
          );
        } else if (atletaData.deportes) {
          deportesSeleccionados = [
            typeof atletaData.deportes === 'object' 
              ? String(atletaData.deportes.id) 
              : String(atletaData.deportes)
          ];
        }

        setFormData({
          nombre: atletaData.nombre || '',
          apPaterno: atletaData.apPaterno || '',
          apMaterno: atletaData.apMaterno || '',
          fechaNacimiento: formattedDate,
          curp: atletaData.curp || '',
          rfc: atletaData.rfc || '',
          sexo: atletaData.sexo || '',
          estadoCivil: atletaData.estadoCivil || '',
          tipoSangre: atletaData.tipoSangre || '',
          categoria_id: categoriaSeleccionada,
          deportes: deportesSeleccionados
        });
      }
    }
  }, [atletaData, isOpen]);

  // Manejador de cambios para validar CURP
  const handleCurpChange = async (e) => {
    const { name, value } = e.target;
    const curpValue = value.toUpperCase();
    
    // Actualizar el estado del formulario
    setFormData(prev => ({
      ...prev,
      [name]: curpValue
    }));
    
    // Resetear validación
    setCurpValidation({
      isValid: null,
      isLoading: false,
      data: null
    });

    // Validar solo cuando tenga 18 caracteres
    if (curpValue.length === 18) {
      setCurpValidation(prev => ({ ...prev, isLoading: true }));
      
      try {
        const validationResult = await validateCurp(curpValue);
        
        if (validationResult.valid) {
          setCurpValidation({
            isValid: true,
            isLoading: false,
            data: validationResult.data
          });
          
          // Autocompletar campos con datos de la CURP
          setFormData(prev => ({
            ...prev,
            sexo: validationResult.data.sexo === 'H' ? 'M' : 'F',
            fechaNacimiento: validationResult.data.fecha_nacimiento || prev.fechaNacimiento
          }));
          
          // Mostrar notificación de éxito
          setError(null);
        } else {
          setCurpValidation({
            isValid: false,
            isLoading: false,
            data: null
          });
          setError("CURP inválida. Verifica que sea correcta.");
        }
      } catch (err) {
        console.error("Error al validar CURP:", err);
        setCurpValidation({
          isValid: false,
          isLoading: false,
          data: null
        });
        setError("Error al validar CURP. Intenta nuevamente.");
      }
    }
  };

  // Manejador de cambios para otros campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleDeporteChange = (deporteId) => {
    setFormData(prev => {
      const idStr = String(deporteId);
      const newDeportes = prev.deportes.includes(idStr)
        ? prev.deportes.filter(id => id !== idStr)
        : [...prev.deportes, idStr];
      return { ...prev, deportes: newDeportes };
    });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar CURP antes de enviar
    if (formData.curp && formData.curp.length !== 18) {
      setError("La CURP debe tener exactamente 18 caracteres");
      return;
    }
    
    if (formData.curp && formData.curp.length === 18 && curpValidation.isValid === false) {
      setError("Por favor corrige la CURP antes de guardar");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const dataToSend = {
        ...formData,
        categoria_id: Number(formData.categoria_id),
        deportes: formData.deportes.map(id => Number(id))
      };
      await onSave(dataToSend);
      onClose();
    } catch (err) {
      console.error("Error al guardar los datos:", err);
      setError(err.response?.data?.message || "Error al guardar los datos. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-dark-700 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Encabezado */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-dark-500">
          <h2 className="text-xl font-bold text-gray-800 dark:text-dark-50">Editar Perfil del Atleta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-dark-300 dark:hover:text-dark-100">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {loadingOptions ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2">Cargando opciones...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Columna 1 - Información Personal */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 dark:text-dark-200 border-b pb-2">Información Personal</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Apellido Paterno</label>
                    <input
                      type="text"
                      name="apPaterno"
                      value={formData.apPaterno}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Apellido Materno</label>
                    <input
                      type="text"
                      name="apMaterno"
                      value={formData.apMaterno}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                      required
                    />
                  </div>
                  
                  <h3 className="font-medium text-gray-700 dark:text-dark-200 border-b pb-2 mt-6">Documentos</h3>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">CURP</label>
                    <input
                      type="text"
                      name="curp"
                      value={formData.curp}
                      onChange={handleCurpChange}
                      maxLength={18}
                      className={`w-full px-3 py-2 border ${
                        formData.curp.length === 18 && curpValidation.isValid === false 
                          ? 'border-red-500' 
                          : 'border-gray-300 dark:border-dark-500'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100`}
                    />
                    {formData.curp.length > 0 && (
                      <div className="absolute right-3 top-8">
                        {curpValidation.isLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                        ) : formData.curp.length === 18 ? (
                          curpValidation.isValid === true ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : curpValidation.isValid === false ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          ) : null
                        ) : null}
                      </div>
                    )}
                    {formData.curp.length === 18 && curpValidation.isValid === false && (
                      <p className="text-xs text-red-500 mt-1">La CURP no es válida</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">RFC</label>
                    <input
                      type="text"
                      name="rfc"
                      value={formData.rfc}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                    />
                  </div>
                </div>

                {/* Columna 2 - Detalles Personales y Deportivos */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 dark:text-dark-200 border-b pb-2">Detalles Personales</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Sexo</label>
                    <select
                      name="sexo"
                      value={formData.sexo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Estado Civil</label>
                    <select
                      name="estadoCivil"
                      value={formData.estadoCivil}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Soltero">Soltero/a</option>
                      <option value="Casado">Casado/a</option>
                      <option value="Divorciado">Divorciado/a</option>
                      <option value="Viudo">Viudo/a</option>
                      <option value="Unión Libre">Unión Libre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Tipo de Sangre</label>
                    <select
                      name="tipoSangre"
                      value={formData.tipoSangre}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  
                  <h3 className="font-medium text-gray-700 dark:text-dark-200 border-b pb-2 mt-6">Información Deportiva</h3>
                  
                  {/* Selector de Categoría */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Categoría</label>
                    <select
                      name="categoria_id"
                      value={formData.categoria_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                    >
                      <option value="">Seleccionar categoría...</option>
                      {categoriasList.map(categoria => (
                        <option key={categoria.id} value={String(categoria.id)}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                    {!loadingOptions && categoriasList.length === 0 && (
                      <p className="text-xs text-yellow-500 mt-1">No hay categorías disponibles</p>
                    )}
                  </div>
                  
                  {/* Selector de Deportes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Deportes</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-300 dark:border-dark-500 rounded-lg">
                      {deportesList.map(deporte => (
                        <div key={deporte.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`deporte-${deporte.id}`}
                            checked={formData.deportes.includes(String(deporte.id))}
                            onChange={() => handleDeporteChange(deporte.id)}
                            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-dark-600 dark:border-dark-500"
                          />
                          <label 
                            htmlFor={`deporte-${deporte.id}`} 
                            className="ml-2 block text-sm text-gray-700 dark:text-dark-300 cursor-pointer"
                          >
                            {deporte.nombre}
                          </label>
                        </div>
                      ))}
                    </div>
                    {formData.deportes.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.deportes.length} deporte(s) seleccionado(s)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-dark-500">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 dark:border-dark-500 rounded-lg text-gray-700 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-dark-600"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-70"
                  disabled={
                    loading || 
                    (formData.curp && formData.curp.length !== 18) ||
                    (formData.curp && formData.curp.length === 18 && curpValidation.isValid === false)
                  }
                >
                  {loading ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}