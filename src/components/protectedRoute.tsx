import React, { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminRoute?: boolean;
  isAdmin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  children,
  isAuthenticated,
  adminRoute,
  isAdmin,
  redirect = "/login",
}: Props) => {
  if (!isAuthenticated) return <Navigate to={redirect} />;

  if(adminRoute && !isAdmin) return <Navigate to={redirect} />;

  return children ? children : <Outlet />; // Return children or null if children is undefined
};

export default ProtectedRoute;
