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
import { updateMetodologo, getAllGruposDeportivos, getAllDeportes, getAllUsuarios } from "../api/metodologoList.api";
import { toast } from "sonner";

export function UpdateMetodologoModal({ isOpen, onClose, row, onUpdate, table }) {
  const metodologo = row?.original || {};
  
  const [formData, setFormData] = useState({
    user: metodologo.user || "", // ID del usuario
    nombre: metodologo.nombre || "",
    aPaterno: metodologo.aPaterno || "",
    aMaterno: metodologo.aMaterno || "",
    grupos: metodologo.grupos || [], // Array de IDs de grupos seleccionados
    deportes: metodologo.deportes || [], // Array de IDs de deportes seleccionados
  });

  const [gruposOptions, setGruposOptions] = useState([]);
  const [deportesOptions, setDeportesOptions] = useState([]);
  const [deportesFiltrados, setDeportesFiltrados] = useState([]);
  const [usuariosOptions, setUsuariosOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGrupos, setIsLoadingGrupos] = useState(false);
  const [isLoadingDeportes, setIsLoadingDeportes] = useState(false);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(false);
  const [error, setError] = useState(null);

  // Actualizar formData cuando cambie el metodólogo
  useEffect(() => {
    if (metodologo && isOpen) {
      setFormData({
        user: metodologo.user || "",
        nombre: metodologo.nombre || "",
        aPaterno: metodologo.aPaterno || "",
        aMaterno: metodologo.aMaterno || "",
        grupos: metodologo.grupos || [],
        deportes: metodologo.deportes || [],
      });
    }
  }, [metodologo, isOpen]);

  // Cargar grupos deportivos, deportes y usuarios
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          setIsLoadingGrupos(true);
          setIsLoadingDeportes(true);
          setIsLoadingUsuarios(true);
          
          const [gruposResponse, deportesResponse, usuariosResponse] = await Promise.all([
            getAllGruposDeportivos(),
            getAllDeportes(),
            getAllUsuarios()
          ]);
          
          // Formatear opciones para grupos
          const gruposOpts = [
            { value: "", label: "Seleccione grupos deportivos", disabled: true },
            ...gruposResponse.data.map(grupo => ({
              value: grupo.id,
              label: grupo.nombre,
              disabled: false,
              deportes: grupo.deportes || []
            }))
          ];
          
          // Formatear opciones para deportes
          const deportesOpts = deportesResponse.data.map(deporte => ({
            value: deporte.id,
            label: deporte.nombre,
            disabled: false,
            grupoId: deporte.grupo // ID del grupo al que pertenece según el modelo Django
          }));
          
          // Formatear opciones para usuarios
          const usuariosOpts = [
            { value: "", label: "Seleccione un usuario", disabled: true },
            ...usuariosResponse.data.map(usuario => ({
              value: usuario.id,
              label: usuario.username || usuario.email || `Usuario ${usuario.id}`,
              disabled: false
            }))
          ];
          
          setGruposOptions(gruposOpts);
          setDeportesOptions(deportesOpts);
          setUsuariosOptions(usuariosOpts);
        } catch (err) {
          console.error("Error cargando datos:", err);
          toast.error("Error al cargar datos");
        } finally {
          setIsLoadingGrupos(false);
          setIsLoadingDeportes(false);
          setIsLoadingUsuarios(false);
        }
      };
      loadData();
    }
  }, [isOpen]);

  // Filtrar deportes basado en los grupos seleccionados
  useEffect(() => {
    if (formData.grupos.length > 0) {
      const deportesFiltradosPorGrupo = deportesOptions.filter(deporte => 
        formData.grupos.includes(deporte.grupoId)
      );
      setDeportesFiltrados(deportesFiltradosPorGrupo);
      
      // Limpiar deportes seleccionados que ya no están disponibles
      const deportesDisponibles = deportesFiltradosPorGrupo.map(d => d.value);
      setFormData(prev => ({
        ...prev,
        deportes: prev.deportes.filter(deporteId => deportesDisponibles.includes(deporteId))
      }));
    } else {
      setDeportesFiltrados([]);
      setFormData(prev => ({ ...prev, deportes: [] }));
    }
  }, [formData.grupos, deportesOptions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.user) {
      setError("Seleccione un usuario");
      toast.error("Seleccione un usuario");
      return;
    }

    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      toast.error("El nombre es requerido");
      return;
    }
    
    if (!formData.aPaterno.trim()) {
      setError("El apellido paterno es requerido");
      toast.error("El apellido paterno es requerido");
      return;
    }

    try {
      setIsLoading(true);
      const updatedData = {
        user: formData.user,
        nombre: formData.nombre.trim(),
        aPaterno: formData.aPaterno.trim(),
        aMaterno: formData.aMaterno.trim(),
        grupos: formData.grupos,
        deportes: formData.deportes
      };
      
      // Actualizar en el backend
      await updateMetodologo(metodologo.id, updatedData);
      
      // Opción 1: Recargar todos los datos desde la API (recomendado)
      if (table?.options?.meta?.reloadData) {
        await table.options.meta.reloadData();
      } else {
        // Opción 2: Actualizar solo el registro local si no hay reloadData
        const completeUpdatedData = {
          ...metodologo,
          ...updatedData,
          usuario: usuariosOptions.find(u => u.value === formData.user),
          gruposNombres: gruposOptions.filter(g => formData.grupos.includes(g.value)).map(g => g.label),
          deportesNombres: deportesFiltrados.filter(d => formData.deportes.includes(d.value)).map(d => d.label)
        };
        onUpdate(metodologo.id, completeUpdatedData);
      }
      
      onClose();
      toast.success(`Metodólogo "${formData.nombre}" actualizado correctamente`);
    } catch (error) {
      console.error("Error al actualizar metodólogo:", error);
      setError(error.response?.data?.message || "Error al actualizar el metodólogo");
      toast.error(`Error al actualizar el metodólogo "${formData.nombre}"`);
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
                Editar Metodólogo
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
                {/* 1. Usuario (llave foránea) */}
                <Select
                  label="Usuario"
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  data={usuariosOptions}
                  isLoading={isLoadingUsuarios}
                  required
                />

                {/* 2. Nombre */}
                <Input
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
                
                {/* 3. Apellido Paterno */}
                <Input
                  label="Apellido Paterno"
                  name="aPaterno"
                  value={formData.aPaterno}
                  onChange={handleInputChange}
                  required
                />
                
                {/* 4. Apellido Materno */}
                <Input
                  label="Apellido Materno"
                  name="aMaterno"
                  value={formData.aMaterno}
                  onChange={handleInputChange}
                />

                {/* 5. Grupos Deportivos - Selección múltiple */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grupos Deportivos
                  </label>
                  {isLoadingGrupos ? (
                    <div className="text-sm text-gray-500">Cargando grupos...</div>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md p-2">
                      {gruposOptions.filter(grupo => !grupo.disabled).map((grupo) => (
                        <label key={grupo.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.grupos.includes(grupo.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  grupos: [...prev.grupos, grupo.value]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  grupos: prev.grupos.filter(id => id !== grupo.value)
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {grupo.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. Deportes - Solo se muestran si hay grupos seleccionados */}
                {formData.grupos.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deportes
                      <span className="text-xs text-gray-500 ml-2">
                        (Filtrados por grupos seleccionados)
                      </span>
                    </label>
                    {isLoadingDeportes ? (
                      <div className="text-sm text-gray-500">Cargando deportes...</div>
                    ) : deportesFiltrados.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md p-2">
                        {deportesFiltrados.map((deporte) => (
                          <label key={deporte.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.deportes.includes(deporte.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    deportes: [...prev.deportes, deporte.value]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    deportes: prev.deportes.filter(id => id !== deporte.value)
                                  }));
                                }
                              }}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {deporte.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 p-2 border border-gray-200 dark:border-gray-600 rounded-md">
                        No hay deportes disponibles para los grupos seleccionados
                      </div>
                    )}
                  </div>
                )}

                {/* Mensaje informativo cuando no hay grupos seleccionados */}
                {formData.grupos.length === 0 && (
                  <div className="text-sm text-gray-500 italic">
                    Seleccione uno o más grupos deportivos para ver los deportes disponibles
                  </div>
                )}
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
                  disabled={isLoadingGrupos || isLoadingDeportes || isLoadingUsuarios}
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