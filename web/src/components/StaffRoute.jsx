import { Navigate } from "react-router-dom";
export default function StaffRoute({ children }) {
  const u = JSON.parse(localStorage.getItem("user") || "null");
  if (!u || u.role !== "staff") return <Navigate to="/" replace />;
  return children;
}