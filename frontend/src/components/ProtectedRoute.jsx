import { Navigate } from "react-router-dom";
import { clearSession, isTokenExpired } from "../utils/auth";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    clearSession();
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
