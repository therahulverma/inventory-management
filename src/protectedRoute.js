import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { authenticated, loading, decodedToken, login } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return <Navigate to={login} />;

  // role-based protection
  if (roles && decodedToken) {
    const userRoles = decodedToken.realm_access?.roles || [];
    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
