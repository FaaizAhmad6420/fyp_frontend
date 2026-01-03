import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Outlet renders the nested route component
  return <Outlet />;
};

export default ProtectedRoute;
