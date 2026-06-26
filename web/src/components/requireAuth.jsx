import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children, roles }) {
  const token = localStorage.getItem("token");
  const role = (JSON.parse(localStorage.getItem("user") || "{}").role || "customer").toLowerCase();
  const loc = useLocation();

  if (!token) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (roles && !roles.map(r => r.toLowerCase()).includes(role))
    return <Navigate to="/login" state={{ err: "forbidden", from: loc.pathname }} replace />;
  return children;
}
