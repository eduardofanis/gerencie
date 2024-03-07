import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

export function UserProtectedRoute({ children }: Props) {
  const { user } = React.useContext(AuthContext);

  return user ? children : <Navigate to="/login" replace />;
}
