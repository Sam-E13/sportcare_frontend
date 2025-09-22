// --- ARCHIVO: src/features/programa/index.jsx ---

import { useState,useEffect } from "react";
import clsx from "clsx";
import { useParams } from "react-router";
// Local Imports
import { Page } from "components/shared/Page";
import { Card, GhostSpinner } from "components/ui";
// CAMBIO: Importar el provider y componentes correctos
import { ProgramaFormProvider } from "./ProgramaFormProvider";
import { Stepper } from "./Stepper";
import { ProgramaCreado } from "./steps/ProgramaCreado";
import { InformacionGeneral } from "./steps/InformacionGeneral";
import { GestionSesiones } from "./steps/GestionSesiones";
import { RevisionFinal } from "./steps/RevisionFinal";
import { getProgramaById } from "../../api/ProgramaEntrenamientoApi";

// ----------------------------------------------------------------------

// CAMBIO: Definición de los pasos del formulario de Programa
const steps = [
  {
    key: "informacionGeneral", // Clave que coincide con el estado inicial
    component: InformacionGeneral,
    label: "Información General",
    description: "Define los datos principales del programa de entrenamiento.",
  },
  {
    key: "gestionSesiones", // Clave que coincide con el estado inicial
    component: GestionSesiones,
    label: "Sesiones y Ejercicios",
    description: "Añade los días de entrenamiento y los ejercicios para cada uno.",
  },
  {
    key: "revisionFinal", // Clave que coincide con el estado inicial
    component: RevisionFinal,
    label: "Revisión y Finalizar",
    description: "Revisa toda la información antes de crear el programa.",
  },
];

// CAMBIO: Renombrado a un nombre más descriptivo
const GestionarProgramaPage = () => {
  const { programaId } = useParams(); // <-- Obtener el ID de la URL
  const isEditMode = !!programaId;    // <-- Determinar si estamos en modo edición
  const [initialState, setInitialState] = useState(null); // <-- Estado para los datos iniciales
  const [isLoading, setIsLoading] = useState(isEditMode); // <-- Cargar si estamos en modo edición
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [finished, setFinished] = useState(false);

  // --- EFECTO PARA CARGAR DATOS EN MODO EDICIÓN ---
  useEffect(() => {
    if (isEditMode) {
      const fetchPrograma = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await getProgramaById(programaId);
          const programa = response.data;

          // --- ESTA ES LA PARTE CORREGIDA ---
          const formattedData = {
            // 1. Envuelve los datos del formulario en la propiedad `formData`
            formData: {
              informacionGeneral: {
                nombre: programa.nombre,
                descripcion: programa.descripcion,
                deporte: programa.deporte,
                nivel: programa.nivel,
                objetivo: programa.objetivo,
                duracion_dias: programa.duracion_dias,
                entrenador: programa.entrenador,
                archivo: programa.archivo ? { name: programa.archivo.split('/').pop() } : null,
              },
              // Las sesiones también van dentro de formData
              // IMPORTANTE: Formatear las sesiones para que los números sean null en lugar de strings vacías
              sesiones: programa.sesiones?.map(sesion => ({
                ...sesion,
                dia: Number(sesion.dia) || sesion.dia,
                ejercicios: sesion.ejercicios?.map(ejercicio => ({
                  ...ejercicio,
                  // Convertir strings vacías o valores no válidos a null
                  repeticiones: ejercicio.repeticiones ? Number(ejercicio.repeticiones) : null,
                  series: ejercicio.series ? Number(ejercicio.series) : null,
                  duracion_segundos: ejercicio.duracion_segundos ? Number(ejercicio.duracion_segundos) : null,
                  distancia_metros: ejercicio.distancia_metros ? Number(ejercicio.distancia_metros) : null,
                  peso_kg: ejercicio.peso_kg ? Number(ejercicio.peso_kg) : null,
                  observaciones: ejercicio.observaciones || ""
                })) || []
              })) || [],
            },
            // 2. Añade el objeto `stepStatus` para que el Stepper funcione
            //    y permita la navegación libre en modo edición.
            stepStatus: {
              informacionGeneral: { isDone: true },
              gestionSesiones: { isDone: true },
              revisionFinal: { isDone: false }, // Este paso no está "hecho" hasta que se guarde
            },
          };

          setInitialState(formattedData);

        } catch (err) {
          console.error("Error al cargar el programa:", err);
          setError("No se pudo cargar la información del programa.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPrograma();
    }
  }, [programaId, isEditMode]); // Las dependencias están bien
  if (isLoading) {
    return <Page title="Cargando Programa..."><GhostSpinner inPage /></Page>;
  }
  if (error) {
    return <Page title="Error"><p className="text-center text-red-500">{error}</p></Page>;
  }

  const ActiveForm = steps[currentStep].component;

  const stepsNode = (
    <>
      <div className="col-span-12 sm:order-last sm:col-span-4 lg:col-span-3">
        <div className="sticky top-24 sm:mt-3">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
      </div>
      <div className="col-span-12 sm:col-span-8 lg:col-span-9">
        <Card className="h-full p-4 sm:p-5">
          <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            {steps[currentStep].label}
          </h5>
          <p className="text-sm text-gray-500 dark:text-dark-200">
            {steps[currentStep].description}
          </p>
          <ActiveForm
            setCurrentStep={setCurrentStep}
            setFinished={setFinished}
            isEditMode={isEditMode}
            programaId={programaId} // El ID para la llamada a la API de actualización
          />
        </Card>
      </div>
    </>
  );

  return (
     <Page title={isEditMode ? "Editar Programa" : "Crear Programa"}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <h2 className="py-5 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:py-6 lg:text-2xl">
          {isEditMode ? "Editar Programa de Entrenamiento" : "Nuevo Programa de Entrenamiento"}
        </h2>

        {/* CAMBIO: Usar el provider correcto */}
        <ProgramaFormProvider initialStateOverride={initialState}>
          <div
            className={clsx(
              "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6",
              !finished && "grid-rows-[auto_1fr] sm:grid-rows-none "
            )}
          >
            {finished ? (
              <div className="col-span-12 place-self-center">
                {/* CAMBIO: Usar el componente de éxito correcto */}
                <ProgramaCreado isEditMode={isEditMode} />
              </div>
            ) : (
              stepsNode
            )}
          </div>
        </ProgramaFormProvider>
      </div>
    </Page>
  );
};

export default GestionarProgramaPage;