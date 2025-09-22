// --- ARCHIVO: src/features/programa/steps/RevisionFinal.jsx ---

import { useState } from "react";
import PropTypes from "prop-types";

// Local Imports
import { Button, GhostSpinner } from "components/ui";
import { useProgramaFormContext } from "../ProgramaFormContext";
import { createPrograma, updatePrograma } from "../../../api/ProgramaEntrenamientoApi"; 

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500 dark:text-dark-300">{label}:</p>
        <p className="font-medium text-gray-800 dark:text-dark-100">{value || '---'}</p>
    </div>
);
InfoItem.propTypes = { label: PropTypes.string, value: PropTypes.any };

function formatExerciseDetails(ej) {
    const parts = [];
    if (ej.series) parts.push(`${ej.series} series`);
    if (ej.repeticiones) parts.push(`${ej.repeticiones} reps`);
    if (ej.peso_kg) parts.push(`${ej.peso_kg} kg`);
    if (ej.duracion_segundos) parts.push(`${ej.duracion_segundos}s`);
    if (ej.distancia_metros) parts.push(`${ej.distancia_metros}m`);
    return parts.join(' x ') || 'Sin métricas';
}

export function RevisionFinal({ setCurrentStep, setFinished, isEditMode, programaId }) {
  const programaFormCtx = useProgramaFormContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  const { informacionGeneral, sesiones } = programaFormCtx.state.formData;

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);

    const formData = new FormData();

    Object.keys(informacionGeneral).forEach(key => {
        const value = informacionGeneral[key];
        
        if (key === 'archivo' && value instanceof File) {
            console.log('📁 Archivo encontrado:', value.name, value.type, value.size);
            formData.append(key, value);
        } else if (key === 'deporte' || key === 'entrenador') {
            const pkValue = value.value || value;
            if (pkValue) {
                formData.append(key, pkValue);
            }
        } else if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
        }
    });


    formData.append('sesiones', JSON.stringify(sesiones));
    
    
    try {
        // --- LÓGICA CONDICIONAL PARA CREAR O ACTUALIZAR ---
        if (isEditMode) {
            await updatePrograma(programaId, formData);
        } else {
            await createPrograma(formData);
        }

        programaFormCtx.dispatch({
            type: "SET_STEP_STATUS",
            payload: { revisionFinal: { isDone: true } },
        });
        setFinished(true);

    } catch (apiError) {
        // ... (Tu manejo de errores está perfecto, sin cambios)
        let errorMessage = "Hubo un error. Revisa los datos o contacta a soporte.";
        if (apiError.response && apiError.response.data) {
             const errors = apiError.response.data;
             errorMessage = Object.entries(errors).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join(' | ');
        }
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pt-6">
      {/* Resumen de Información General */}
      <div>
        <h3 className="border-b border-gray-200 pb-2 text-lg font-semibold dark:border-dark-500">Resumen del Programa</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          <InfoItem label="Nombre" value={informacionGeneral.nombre} />
          <InfoItem label="Objetivo" value={informacionGeneral.objetivo} />
          <InfoItem label="Nivel" value={informacionGeneral.nivel} />
          <InfoItem label="Deporte" value={informacionGeneral.deporte.label || 'No especificado'} />
          <InfoItem label="Duración" value={`${informacionGeneral.duracion_dias} días`} />
          <InfoItem label="Entrenador" value={informacionGeneral.entrenador?.label || 'No especificado'} />
        </div>
        <div className="mt-4">
            <InfoItem label="Descripción" value={informacionGeneral.descripcion} />
        </div>
        {informacionGeneral.archivo && (
             <div className="mt-4">
                <InfoItem label="Archivo Adjunto" value={informacionGeneral.archivo.name} />
             </div>
        )}
      </div>
      
      {/* Resumen de Sesiones */}
      <div>
        <h3 className="border-b border-gray-200 pb-2 text-lg font-semibold dark:border-dark-500">Sesiones de Entrenamiento</h3>
        <div className="mt-4 space-y-6">
            {sesiones?.length > 0 ? (
                sesiones.map((sesion, index) => (
                    <div key={index} className="rounded-md border p-4 dark:border-dark-500">
                        <h4 className="font-semibold text-primary-600 dark:text-primary-400">Día {sesion.dia}: {sesion.titulo}</h4>
                        <p className="text-sm text-gray-600 dark:text-dark-200">{sesion.descripcion}</p>
                        <ul className="mt-3 list-disc space-y-1 pl-5">
                            {sesion.ejercicios.map((ej, i) => (
                               <li key={i} className="text-sm">
                                   <span className="font-medium">{ej.nombre}</span>: {formatExerciseDetails(ej)}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No se han añadido sesiones de entrenamiento.</p>
            )}
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-center">
            <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Botones de Navegación */}
      <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
        <Button className="min-w-[7rem]" onClick={() => setCurrentStep(1)} disabled={loading}>
          Atrás
        </Button>
        <Button
          onClick={handleFinalSubmit}
          className="min-w-[7rem] space-x-2 rtl:space-x-reverse"
          color="primary"
          disabled={loading}
        >
          {loading && <GhostSpinner className="size-4 border-2" />}
          <span>{loading ? (isEditMode ? 'Actualizando...' : 'Creando...') : (isEditMode ? 'Guardar Cambios' : 'Finalizar y Crear Programa')}</span>
        </Button>
      </div>
    </div>
  );
}

RevisionFinal.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
  setFinished: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  programaId: PropTypes.string,
};