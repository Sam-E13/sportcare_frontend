// Import Dependencies
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

// Local Imports
import { useTipoUsuario } from 'hooks/useTipoUsuario';
import { useAuthContext } from "app/contexts/auth/context"; // Importamos el contexto de autenticación



// ----------------------------------------------------------------------

export default function RoleGuard({ children, allowedRoles }) {
  const { isAuthenticated } = useAuthContext();
  const tipoUsuario = useTipoUsuario();
  const location = useLocation();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(tipoUsuario)) {
    // Si el rol del usuario no está permitido, redirigir a una página de no autorizado
    // o a la página de inicio.
    return <Navigate to="/errores/" replace />;
  }

  return <>{children}</>;
}

RoleGuard.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};