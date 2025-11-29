import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const allowedRoles = ["admin", "owner", "employee"];

const AdminRoute = ({ children, redirectPath = "/login" }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
};

export default AdminRoute;
