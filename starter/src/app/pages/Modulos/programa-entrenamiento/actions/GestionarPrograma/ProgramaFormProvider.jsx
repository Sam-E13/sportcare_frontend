// --- ARCHIVO: src/features/programa/ProgramaFormProvider.jsx ---

import PropTypes from "prop-types";
import { useReducer } from "react";
import { ProgramaFormContextProvider } from "./ProgramaFormContext";

// ----------------------------------------------------------------------

// CAMBIO: Estado inicial completamente rediseñado para el Programa de Entrenamiento
const initialState = {
  formData: {
    informacionGeneral: {
      nombre: "",
      descripcion: "",
      deporte: "", 
      nivel: "",
      objetivo: "",
      duracion_dias: "",
      entrenador: "",
      archivo: null,
    },
    sesiones: [],
  },
  stepStatus: {
    informacionGeneral: { isDone: false },
    gestionSesiones: { isDone: false },
    revisionFinal: { isDone: false },
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case "SET_STEP_STATUS":
      return {
        ...state,
        stepStatus: {
          ...state.stepStatus,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export function ProgramaFormProvider({ children, initialStateOverride }) {
  // <<-- USAR EL ESTADO INICIAL PERSONALIZADO SI EXISTE -->>
  const [state, dispatch] = useReducer(reducer, initialStateOverride || initialState);
  const value = { state, dispatch };
  return (
    <ProgramaFormContextProvider value={value}>{children}</ProgramaFormContextProvider>
  );
}

ProgramaFormProvider.propTypes = {
  children: PropTypes.node,
  initialStateOverride: PropTypes.object, // <<-- AÑADIR NUEVO PROP TYPE
};