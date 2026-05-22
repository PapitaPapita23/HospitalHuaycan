import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../modules/auth/context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  // Si el usuario no está autenticado, redirigir a Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol del usuario no está dentro de los permitidos, redirigir a No Autorizado
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Renderizar rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;
