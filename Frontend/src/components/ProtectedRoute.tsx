import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/router/routes";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { staff } = useAuth();
  const location = useLocation();

  if (!staff) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // 3. LẤY ROLE TỪ staff
  const userRole = staff.role?.toLowerCase();

  let isAllowed = false;
  for (const role of allowedRoles) {
    if (role.toLowerCase() === userRole) {
      isAllowed = true;
      break;
    }
  }

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
