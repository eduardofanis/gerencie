import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

type Props = {
  children: React.ReactNode;
};

export function UserProtectedRoute({ children }: Props) {
  const { user } = useContext(AuthContext);

  return user ? children : <Navigate to="/login" replace />;
}

export function SubscriptionProtectedRoute({ children }: Props) {
  const { subscription } = useContext(AuthContext);

  return subscription ? children : <Navigate to="/conta" replace />;
}
