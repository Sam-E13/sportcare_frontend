// --- ARCHIVO: src/features/programa/steps/InformacionGeneral.jsx ---

// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

// Local Imports
import { Button, Input, Select, Textarea } from "components/ui";
import { useProgramaFormContext } from "../ProgramaFormContext";
import { programaInfoBasicaSchema } from "../schema";
import { getAllDeportes, getAllEntrenadores } from "../../../api/ProgramaEntrenamientoApi";

import { FilePond } from "components/shared/form/Filepond";
// ----------------------------------------------------------------------

export function InformacionGeneral({ setCurrentStep }) {
  const programaFormCtx = useProgramaFormContext();

  // --- ESTADOS PARA LOS DATOS Y LA CARGA ---
  const [deportesOptions, setDeportesOptions] = useState([]);
  const [entrenadoresOptions, setEntrenadoresOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // <<-- AÑADIDO: Estado de carga general

  // --- EFECTO PARA CARGAR TODOS LOS DATOS INICIALES ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Ejecutamos ambas llamadas a la API en paralelo para más eficiencia
        const [deportesResponse, entrenadoresResponse] = await Promise.all([
          getAllDeportes(),
          getAllEntrenadores(),
        ]);

        // Mapeamos los deportes
        const deportesOpts = deportesResponse.data.map((deporte) => ({
          label: deporte.nombre,
          value: deporte.id,
        }));
        setDeportesOptions(deportesOpts);

        // Mapeamos los entrenadores
        const entrenadoresOpts = entrenadoresResponse.data.map((entrenador) => ({
          label: `${entrenador.nombre} ${entrenador.apPaterno} ${entrenador.apMaterno}`,
          value: entrenador.id,
        }));
        setEntrenadoresOptions(entrenadoresOpts);

      } catch (error) {
        console.error("Error al obtener los datos iniciales:", error);
        // Opcional: Mostrar un error en la UI
      } finally {
        setIsLoading(false); // <<-- AÑADIDO: Finaliza la carga (con o sin error)
      }
    };

    fetchInitialData();
  }, []); // El array vacío asegura que esto se ejecute solo una vez


  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(programaInfoBasicaSchema),
    defaultValues: programaFormCtx.state.formData.informacionGeneral,
  });

  // Tu lógica onSubmit ya es correcta, no necesita cambios.
  // Solo se ejecutará cuando los datos ya estén cargados.
  const onSubmit = (data) => {
    const fullDeporte = deportesOptions.find(opt => opt.value === data.deporte);
    const fullEntrenador = entrenadoresOptions.find(opt => opt.value === data.entrenador);
    
    const dataToDispatch = {
        ...data,
        deporte: fullDeporte || data.deporte,
        entrenador: fullEntrenador || data.entrenador,
    }

    programaFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { informacionGeneral: dataToDispatch },
    });
    programaFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { informacionGeneral: { isDone: true } },
    });
    setCurrentStep(1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-6 pt-6">
      {/* ... El resto de tus inputs no cambian ... */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-100">
        Información General del Programa
      </h2>

      {/* Fila 1: Nombre y Objetivo */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          {...register("nombre")}
          label="Nombre del Programa"
          placeholder="Ej: Plan de Fuerza para Corredores"
          error={errors.nombre?.message}
        />
        <Input
          {...register("objetivo")}
          label="Objetivo Principal"
          placeholder="Ej: Aumentar la resistencia"
          error={errors.objetivo?.message}
        />
      </div>
      
      {/* Fila 2: Deporte, Nivel y Duración */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Controller
          name="deporte"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Deporte"
              placeholder={isLoading ? "Cargando..." : "Selecciona un deporte"}
              error={errors.deporte?.message}
              data={deportesOptions}
              disabled={isLoading} // <<-- AÑADIDO: Deshabilitado mientras carga
            />
          )}
        />

        <Controller
          name="nivel"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Nivel"
              placeholder="Selecciona un nivel"
              error={errors.nivel?.message}
              data={[
                { value: 'básico', label: 'Básico' },
                { value: 'intermedio', label: 'Intermedio' },
                { value: 'avanzado', label: 'Avanzado' },
              ]}
            />
          )}
        />
        <Input
          {...register("duracion_dias")}
          type="number"
          label="Duración (días)"
          placeholder="Ej: 90"
          error={errors.duracion_dias?.message}
        />
      </div>

       {/* Fila 3: Descripción */}
      <Textarea
        {...register("descripcion")}
        component={TextareaAutosize}
        minRows={4}
        label="Descripción del Programa"
        placeholder="Describe en qué consiste el programa, a quién va dirigido, etc."
        error={errors.descripcion?.message}
      />
      
      {/* Fila 4: Entrenador y Archivo */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
         <Controller 
          name="entrenador" 
          control={control} 
          render={({ field }) => ( 
              <Select {...field} 
              label="Entrenador Asignado" 
              placeholder={isLoading ? "Cargando..." : "Selecciona un entrenador"} 
              error={errors.entrenador?.message} 
              data={entrenadoresOptions} 
              disabled={isLoading} // <<-- AÑADIDO: Deshabilitado mientras carga
              /> 
            )}
           />

        <div className="flex flex-col">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-dark-200">
            Archivo del Plan (Opcional)
          </label>
          <Controller
              name="archivo"
              control={control}
              defaultValue={programaFormCtx.state.formData.informacionGeneral.archivo}
              render={({ field: { onChange, value } }) => (
                  <FilePond
                      files={value ? [value] : []} 
                      onupdatefiles={(fileItems) => {
                          const firstFile = fileItems.length > 0 ? fileItems[0].file : null;
                          onChange(firstFile);
                          programaFormCtx.dispatch({
                              type: "SET_FORM_DATA",
                              payload: { 
                                  informacionGeneral: {
                                      ...programaFormCtx.state.formData.informacionGeneral,
                                      archivo: firstFile
                                  }
                              }
                          });
                      }}
                      allowMultiple={false}
                      labelIdle='Arrastra y suelta tu archivo o <span class="filepond--label-action">Navega</span>'
                  />
              )}
          />
          {errors.archivo && <p className="mt-1.5 text-xs text-red-500">{errors.archivo.message}</p>}
        </div>
      </div>

      {/* Botones de Navegación */}
      <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
        <Button className="min-w-[7rem]" disabled>
          Atrás
        </Button>
        <Button 
            type="submit" 
            className="min-w-[7rem]" 
            color="primary" 
            disabled={isLoading} // <<-- AÑADIDO: Botón deshabilitado mientras carga
        >
          {isLoading ? "Cargando..." : "Siguiente"}
        </Button>
      </div>
    </form>
  );
}

InformacionGeneral.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};