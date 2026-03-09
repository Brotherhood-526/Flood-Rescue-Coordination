import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/router/routes";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { staff } = useAuth();
  const location = useLocation();
  const normalizeRole = (value?: string | null) => (value ?? "").trim().toLowerCase();

  if (!staff) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // 3. LẤY ROLE TỪ staff
  const userRole = normalizeRole(staff.role);

  let isAllowed = false;
  for (const role of allowedRoles) {
    if (normalizeRole(role) === userRole) {
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
