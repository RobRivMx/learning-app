// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const token = localStorage.getItem('token');

  // Si hay un token, muestra el contenido de la página solicitada.
  // El <Outlet /> es un placeholder para el componente de la ruta anidada.
  if (token) {
    return <Outlet />;
  }

  // Si no hay token, redirige al usuario a la página de login.
  return <Navigate to="/login" />;
}

export default ProtectedRoute;