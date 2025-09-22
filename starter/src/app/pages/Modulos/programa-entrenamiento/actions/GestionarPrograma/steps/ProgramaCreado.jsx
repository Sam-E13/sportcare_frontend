
import PropTypes from "prop-types";
import Rocket from "assets/illustrations/rocket.svg?react";
import { Link } from "react-router"; // O tu componente de Link
import { Button } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";

export function ProgramaCreado({ isEditMode }) {
   const theme = useThemeContext();
  return (
    <div className="h-full text-center">
       <Rocket
        className="mx-auto h-auto w-56 sm:w-64"
        style={{
          "--primary": theme.primaryColorScheme[600],
          "--darker": theme.darkColorScheme[600],
        }}
      />
      <p className="mt-6 pt-4 text-xl font-semibold text-gray-800 dark:text-dark-50">
        {isEditMode ? '¡Programa actualizado con éxito!' : '¡Programa creado con éxito!'}
      </p>
      <p className="mx-auto mt-2 max-w-screen-lg text-balance sm:px-5">
        {isEditMode ? 'Los cambios ya están reflejados en el listado.' : 'Tu nuevo programa ya está disponible en el listado de Asignación.'}
      </p>
      <Button
        color="primary"
        className="mt-8 w-full px-10 sm:w-auto"
        to="Modulos/Programas-Entrenamiento" // Enlace relevante
        component={Link}
      >
        Ir a Mis Programas
      </Button>
    </div>
  );
}
ProgramaCreado.propTypes = {
  isEditMode: PropTypes.bool,
};