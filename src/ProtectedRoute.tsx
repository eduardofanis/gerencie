import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import { SubscriberContext } from "./contexts/SubscriberContext";
import { CollaboratorContext } from "./contexts/CollaboratorContext";

type Props = {
  children: React.ReactNode;
};

export function UserProtectedRoute({ children }: Props) {
  const { user } = React.useContext(AuthContext);

  return user ? children : <Navigate to="/login" replace />;
}

export function SubscriptionProtectedRoute({ children }: Props) {
  const { subscriber } = React.useContext(SubscriberContext);

  return subscriber ? children : <Navigate to="/conta" replace />;
}

export function MidProtectedRoute({ children }: Props) {
  const { subscriber } = React.useContext(SubscriberContext);

  return subscriber?.plano !== "Individual" ? (
    children
  ) : (
    <Navigate to="/conta" replace />
  );
}

export function HighProtectedRoute({ children }: Props) {
  const { subscriber } = React.useContext(SubscriberContext);

  return subscriber?.plano === "Empresarial" ? (
    children
  ) : (
    <Navigate to="/conta" replace />
  );
}

export function PermissaoGerenciarColaboradoresProtectedRoute({
  children,
}: Props) {
  const { collaborator } = React.useContext(CollaboratorContext);
  const { subscriber } = React.useContext(SubscriberContext);

  function checkPermission() {
    if (collaborator?.permissions.gerenciarColaboradores === false) {
      return false;
    }

    if (subscriber?.plano === "Individual") {
      return false;
    }

    return true;
  }

  return checkPermission() ? children : <Navigate to="/conta" replace />;
}

export function PermissaoGerenciarAutomacoesProtectedRoute({
  children,
}: Props) {
  const { collaborator } = React.useContext(CollaboratorContext);
  const { subscriber } = React.useContext(SubscriberContext);

  function checkPermission() {
    if (subscriber?.plano !== "Empresarial") {
      return false;
    }

    if (collaborator?.permissions.gerenciarAutomacoes === false) {
      return false;
    }

    return true;
  }

  return checkPermission() ? children : <Navigate to="/conta" replace />;
}
