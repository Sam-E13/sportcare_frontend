// --- ARCHIVO: GestionSesiones.jsx (CORREGIDO) ---

import { useEffect } from "react"; // Asegúrate de que useEffect esté importado
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
import PropTypes from "prop-types";
import TextareaAutosize from "react-textarea-autosize";
import { TrashIcon } from "@heroicons/react/24/outline";
// Local Imports
import { Button, Input, Textarea } from "components/ui";
import { useProgramaFormContext } from "../ProgramaFormContext";
import { programaEntrenamientoSchema } from "../schema";

// --- SUB-COMPONENTE: FormularioEjercicio (Sin cambios) ---
function FormularioEjercicio({ form, sessionIndex, exerciseIndex }) {
  const { register, formState: { errors } } = form;
  const error = errors.sesiones?.[sessionIndex]?.ejercicios?.[exerciseIndex];

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-dark-500 dark:bg-dark-700">
      <Input
        {...register(`sesiones.${sessionIndex}.ejercicios.${exerciseIndex}.nombre`)}
        label="Nombre del Ejercicio"
        placeholder="Ej: Press de banca"
        error={error?.nombre?.message}
      />
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Input {...register(`sesiones.${sessionIndex}.ejercicios.${exerciseIndex}.repeticiones`)} type="number" label="Repeticiones"  error={error?.repeticiones?.message} />
        <Input {...register(`sesiones.${sessionIndex}.ejercicios.${exerciseIndex}.series`)} type="number" label="Series" error={error?.series?.message} />
        <Input {...register(`sesiones.${sessionIndex}.ejercicios.${exerciseIndex}.duracion_segundos`)} type="number" label="Duración (seg)"  error={error?.duracion_segundos?.message} />
        <Input {...register(`sesiones.${sessionIndex}.ejercicios.${exerciseIndex}.distancia_metros`)} type="number" label="Distancia (m)"  error={error?.distancia_metros?.message} />
        <Input {...register(`sesiones.${sessionIndex}.ejercicios.${exerciseIndex}.peso_kg`)} type="number" label="Peso (kg)"  error={error?.peso_kg?.message} />
      </div>
      <Textarea
        {...register(`sesiones.${sessionIndex}.ejercicios.${exerciseIndex}.observaciones`)}
        className="mt-4"
        component={TextareaAutosize}
        minRows={2}
        label="Observaciones (Opcional)"
        error={error?.observaciones?.message}
      />
      {errors.sesiones?.[sessionIndex]?.ejercicios?.[exerciseIndex]?.message && (
        <p className="mt-2 text-sm text-red-600">{errors.sesiones?.[sessionIndex]?.ejercicios?.[exerciseIndex]?.message}</p>
      )}
    </div>
  );
}
FormularioEjercicio.propTypes = { form: PropTypes.object, sessionIndex: PropTypes.number, exerciseIndex: PropTypes.number };


// --- SUB-COMPONENTE: FormularioSesion (Sin cambios) ---
function FormularioSesion({ form, sessionIndex, removeSession }) {
  const { control, register, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sesiones.${sessionIndex}.ejercicios`,
  });

  const addNewExercise = () => append({
    nombre: "", repeticiones: null, series: null, duracion_segundos: null,
    distancia_metros: null, peso_kg: null, observaciones: ""
  });

  const error = errors.sesiones?.[sessionIndex];

  return (
    <div className="rounded-lg border bg-white p-4 dark:border-dark-500 dark:bg-dark-800">
      <div className="flex items-start justify-between">
        <h4 className="text-lg font-semibold">Sesión del Día {register(`sesiones.${sessionIndex}.dia`).value || ""}</h4>
        <Button color="neutral" variant="soft" onClick={() => removeSession(sessionIndex)}>Eliminar Sesión</Button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input {...register(`sesiones.${sessionIndex}.dia`)} type="number" label="Día del Programa" placeholder="Ej: 1" error={error?.dia?.message} />
        <Input {...register(`sesiones.${sessionIndex}.titulo`)} label="Título de la Sesión" placeholder="Ej: Tren Superior - Empuje" error={error?.titulo?.message} />
      </div>
      <Textarea
        {...register(`sesiones.${sessionIndex}.descripcion`)}
        className="mt-4" component={TextareaAutosize} minRows={3} label="Descripción de la Sesión"
        error={error?.descripcion?.message}
      />

      <div className="mt-6">
        <h5 className="font-semibold">Ejercicios</h5>
        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="relative">
              <FormularioEjercicio form={form} sessionIndex={sessionIndex} exerciseIndex={index}  />
              <Button  color="error" variant="soft" isIcon className="absolute top-2 right-2 size-7" onClick={() => remove(index)}>
                  <TrashIcon className="size-5" />
               </Button>
            </div>
          ))}
        </div>
        {error?.ejercicios?.message && !error.ejercicios.length && (
          <p className="mt-2 text-sm text-red-600">{error.ejercicios.message}</p>
        )}
        <Button className="mt-4" variant="solid" onClick={addNewExercise}>
          + Añadir Ejercicio
        </Button>
      </div>
    </div>
  );
}
FormularioSesion.propTypes = { form: PropTypes.object, sessionIndex: PropTypes.number, removeSession: PropTypes.func };


// --- COMPONENTE PRINCIPAL: GestionSesiones (CON LAS CORRECCIONES) ---
export function GestionSesiones({ setCurrentStep }) {
  const programaFormCtx = useProgramaFormContext();

  // 1. Guardamos todos los métodos de useForm en la constante 'form'
  //    Esto soluciona el error "'form' is not defined".
  const form = useForm({
    resolver: yupResolver(programaEntrenamientoSchema),
    defaultValues: {
      ...programaFormCtx.state.formData.informacionGeneral,
      sesiones: programaFormCtx.state.formData.sesiones || [],
    },
    mode: 'onBlur',
  });

  // 2. Desestructuramos lo que necesitamos directamente de 'form'.
  const { control, handleSubmit, reset, formState: { errors } } = form;

  // --- LÓGICA DE useEffect CORREGIDA Y MEJORADA ---
  // Hacemos una referencia directa a las sesiones del contexto
  const sesionesDelContexto = programaFormCtx.state.formData.sesiones;

  useEffect(() => {
    if (sesionesDelContexto && sesionesDelContexto.length > 0) {
      reset({
        ...programaFormCtx.state.formData.informacionGeneral, // Mantenemos los datos de info general
        sesiones: sesionesDelContexto, // Y reseteamos específicamente el array de sesiones
      });
    }
  }, [sesionesDelContexto, reset, programaFormCtx.state.formData.informacionGeneral]); // Dependemos de los datos específicos


  const { fields, append, remove } = useFieldArray({
    control,
    name: "sesiones",
  });

  const onSubmit = (data) => {
    programaFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { sesiones: data.sesiones },
    });
    programaFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { gestionSesiones: { isDone: true } },
    });
    setCurrentStep(2);
  };

  const addNewSession = () => append({
    dia: (fields.length > 0 ? Math.max(...fields.map(f => f.dia || 0)) : 0) + 1,
    titulo: "",
    descripcion: "",
    ejercicios: []
  });

   return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sesiones de Entrenamiento</h2>
        <Button onClick={addNewSession} color="primary">+ Añadir Sesión</Button>
      </div>

      {errors.sesiones?.message && !errors.sesiones.length && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{errors.sesiones.message}</p>
        </div>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <FormularioSesion key={field.id} form={form} sessionIndex={index} removeSession={remove} />
        ))}
      </div>

      <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
        <Button className="min-w-[7rem]" onClick={() => setCurrentStep(0)}>
          Atrás
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Siguiente
        </Button>
      </div>
    </form>
  );
}
GestionSesiones.propTypes = { setCurrentStep: PropTypes.func.isRequired };