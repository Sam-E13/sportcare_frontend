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
import { 
  updateAtleta,
  getAllUsers,
  getAllCategorias,
  getAllDeportes 
} from "./api/atletaList.api";
import { validateCurp } from "./api/curp.api"; // Importación de la API de CURP
import { toast } from "sonner";

export function UpdateAtletaModal({ isOpen, onClose, atleta, onUpdate }) {
  const [formData, setFormData] = useState({
    user_id: "",
    nombre: "",
    apPaterno: "",
    apMaterno: "",
    fechaNacimiento: "",
    sexo: "M",
    curp: "",
    rfc: "",
    estadoCivil: "",
    tipoSangre: "",
    deportes: [],
    categoria_id: ""
  });

  const [users, setUsers] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [curpValidation, setCurpValidation] = useState({
    isValid: null,
    isLoading: false,
    data: null
  });

  const sexoOptions = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Femenino" }
  ];

  const estadoCivilOptions = [
    { value: "Soltero/a", label: "Soltero/a" },
    { value: "Casado/a", label: "Casado/a" },
    { value: "Divorciado/a", label: "Divorciado/a" },
    { value: "Viudo/a", label: "Viudo/a" },
    { value: "Unión Libre", label: "Unión Libre" }
  ];

  const tipoSangreOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" }
  ];

  useEffect(() => {
    if (isOpen && atleta) {
      const loadData = async () => {
        try {
          setIsLoading(true);
          const loadingToast = toast.loading('Cargando datos del atleta...');
          const [usersRes, categoriasRes, deportesRes] = await Promise.all([
            getAllUsers(),
            getAllCategorias(),
            getAllDeportes()
          ]);

          setUsers([
            { value: "", label: "Seleccione un usuario", disabled: true },
            ...usersRes.data.map(u => ({
              value: String(u.id),
              label: u.username || `Usuario ${u.id}`,
              disabled: false
            }))
          ]);

          setCategorias([
            { value: "", label: "Seleccione una categoría", disabled: true },
            ...categoriasRes.data.map(c => ({
              value: String(c.id),
              label: c.nombre || `Categoría ${c.id}`,
              disabled: false
            }))
          ]);

          setDeportes(deportesRes.data);

          // Manejo robusto de deportes seleccionados
          const deportesSeleccionados = atleta.deportes
            ? Array.isArray(atleta.deportes)
              ? atleta.deportes.map(d => String(d.id || d))
              : typeof atleta.deportes === 'object'
                ? [String(atleta.deportes.id)]
                : [String(atleta.deportes)]
            : [];

          setFormData({
            user_id: atleta.user ? String(atleta.user.id || atleta.user) : atleta.user_id ? String(atleta.user_id) : "",
            nombre: atleta.nombre || "",
            apPaterno: atleta.apPaterno || "",
            apMaterno: atleta.apMaterno || "",
            fechaNacimiento: atleta.fechaNacimiento?.split('T')[0] || "",
            sexo: atleta.sexo || "M",
            curp: atleta.curp || "",
            rfc: atleta.rfc || "",
            estadoCivil: atleta.estadoCivil || "",
            tipoSangre: atleta.tipoSangre || "",
            deportes: deportesSeleccionados,
            categoria_id: atleta.categoria ? String(atleta.categoria.id || atleta.categoria) : atleta.categorias ? String(atleta.categorias.id || atleta.categorias) : ""
          });

          // Resetear validación de CURP
          setCurpValidation({
            isValid: null,
            isLoading: false,
            data: null
          });

          toast.dismiss(loadingToast);
        } catch (err) {
          console.error("Error cargando opciones:", err);
          setError("Error al cargar los datos necesarios");
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }
  }, [isOpen, atleta]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  
    if (name === "curp") {
      const curpValue = value.toUpperCase();
      
      setCurpValidation({
        isValid: null,
        isLoading: false,
        data: null
      });

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
            
            setFormData(prev => ({
              ...prev,
              sexo: validationResult.data.sexo === 'H' ? 'M' : 'F',
              fechaNacimiento: validationResult.data.fecha_nacimiento || prev.fechaNacimiento
            }));
            
            toast.success("CURP validada correctamente");
          } else {
            setCurpValidation({
              isValid: false,
              isLoading: false,
              data: null
            });
            toast.error("CURP inválida. Verifica que sea correcta.");
          }
        } catch (err) {
          console.error("Error al validar CURP:", err);
          setCurpValidation({
            isValid: false,
            isLoading: false,
            data: null
          });
          toast.error("Error al validar CURP");
        }
      }
    }
  };

  const handleDeporteChange = (deporteId) => {
    setFormData(prev => {
      const newDeportes = prev.deportes.includes(deporteId)
        ? prev.deportes.filter(id => id !== deporteId)
        : [...prev.deportes, deporteId];
      return { ...prev, deportes: newDeportes };
    });
  };

  const handleSubmit = async () => {
    if (formData.curp.length !== 18) {
      toast.error("La CURP debe tener exactamente 18 caracteres");
      return;
    }

    if (curpValidation.isValid === false) {
      toast.error("Por favor corrige la CURP antes de continuar");
      return;
    }

    const requiredFields = [
      { name: 'nombre', label: 'Nombre' },
      { name: 'apPaterno', label: 'Apellido Paterno' },
      { name: 'apMaterno', label: 'Apellido Materno' },
      { name: 'fechaNacimiento', label: 'Fecha de Nacimiento' },
      { name: 'sexo', label: 'Sexo' },
      { name: 'curp', label: 'CURP' },
      { name: 'rfc', label: 'RFC' },
      { name: 'categoria_id', label: 'Categoría' }
    ];
  
    const missingFields = requiredFields.filter(field => !formData[field.name]);
    if (missingFields.length > 0) {
      const errorMessage = `Faltan campos requeridos: ${missingFields.map(f => f.label).join(', ')}`;
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
  
    try {
      setIsLoading(true);
      const loadingToast = toast.loading('Actualizando atleta...');
      
      const payload = {
        nombre: formData.nombre,
        apPaterno: formData.apPaterno,
        apMaterno: formData.apMaterno,
        fechaNacimiento: formData.fechaNacimiento,
        sexo: formData.sexo,
        curp: formData.curp,
        rfc: formData.rfc,
        estadoCivil: formData.estadoCivil,
        tipoSangre: formData.tipoSangre,
        user: formData.user_id ? Number(formData.user_id) : null,
        categorias: formData.categoria_id ? Number(formData.categoria_id) : null,
        deportes: formData.deportes.map(id => Number(id))
      };

      const response = await updateAtleta(atleta.id, payload);
      
      // Crear objeto actualizado con los nombres de deportes
      const updatedAtleta = {
        ...response.data,
        deportes: formData.deportes.map(id => Number(id)), // IDs para referencia
        deportes_display: deportes
          .filter(d => formData.deportes.includes(String(d.id)))
          .map(d => d.nombre)
          .join(', ') || "No especificado"
      };

      toast.dismiss(loadingToast);
      toast.success('Atleta actualizado correctamente');

      onUpdate(updatedAtleta);
      onClose();
    } catch (err) {
      console.error("Error al actualizar atleta:", err);
      
      let errorMessage = "Error al actualizar el atleta";
      if (err.response) {
        if (err.response.data?.errors) {
          errorMessage = Object.values(err.response.data.errors).flat().join(', ');
        } else {
          errorMessage = err.response.data?.detail || 
                       err.response.data?.message || 
                       errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
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
                Editar Atleta
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
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleSelectChange}
                  data={users}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Apellido Paterno"
                  name="apPaterno"
                  value={formData.apPaterno}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Apellido Materno"
                  name="apMaterno"
                  value={formData.apMaterno}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Fecha de Nacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />

                <Select
                  label="Sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleSelectChange}
                  data={sexoOptions}
                  required
                  disabled={isLoading}
                />

                <div className="relative">
                  <Input
                    label="CURP"
                    name="curp"
                    value={formData.curp}
                    onChange={handleInputChange}
                    required
                    className={
                      formData.curp.length === 18 && 
                      curpValidation.isValid === false ? 
                      "border-red-500" : ""
                    }
                    maxLength={18}
                    disabled={isLoading}
                  />
                  {formData.curp.length > 0 && (
                    <div className="absolute right-2 top-9">
                      {curpValidation.isLoading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
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
                    <p className="text-sm text-red-600 mt-1">CURP no válida. Por favor verifica.</p>
                  )}
                </div>

                <Input
                  label="RFC"
                  name="rfc"
                  value={formData.rfc}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />

                <Select
                  label="Estado Civil"
                  name="estadoCivil"
                  value={formData.estadoCivil}
                  onChange={handleSelectChange}
                  data={estadoCivilOptions}
                  disabled={isLoading}
                />

                <Select
                  label="Tipo de Sangre"
                  name="tipoSangre"
                  value={formData.tipoSangre}
                  onChange={handleSelectChange}
                  data={tipoSangreOptions}
                  disabled={isLoading}
                />

                <Select
                  label="Categoría"
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleSelectChange}
                  data={categorias}
                  required
                  disabled={isLoading}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-100 mb-2">
                    Deportes
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {deportes.map(deporte => (
                      <div key={deporte.id} className="flex items-center">
                        <Checkbox
                          id={`deporte-${deporte.id}`}
                          checked={formData.deportes?.includes(String(deporte.id))}
                          onChange={() => handleDeporteChange(String(deporte.id))}
                          disabled={isLoading}
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
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  color="primary"
                  className="min-w-[7rem] rounded-full"
                  loading={isLoading ? "true" : undefined}
                  disabled={
                    isLoading ||
                    (formData.curp.length > 0 && formData.curp.length !== 18) ||
                    (formData.curp.length === 18 && curpValidation.isValid === false)
                  }
                >
                  Guardar cambios
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}