import React from "react";
import { Navigate } from "react-router-dom";
import { SubscriberContext } from "../contexts/SubscriberContext";

type Props = {
  children: React.ReactNode;
};

export function SubscriberProtectedRoute({ children }: Props) {
  const { subscriber } = React.useContext(SubscriberContext);

  return subscriber ? children : <Navigate to="/conta" replace />;
}

export function MidSubscriberProtectedRoute({ children }: Props) {
  const { subscriber } = React.useContext(SubscriberContext);

  return subscriber?.plano !== "Individual" ? (
    children
  ) : (
    <Navigate to="/conta" replace />
  );
}

export function HighSubscriberProtectedRoute({ children }: Props) {
  const { subscriber } = React.useContext(SubscriberContext);

  return subscriber?.plano === "Empresarial" ? (
    children
  ) : (
    <Navigate to="/conta" replace />
  );
}
