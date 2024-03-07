import React from "react";
import { Navigate } from "react-router-dom";
import { SubscriberContext } from "../contexts/SubscriberContext";
import { CollaboratorContext } from "../contexts/CollaboratorContext";

type Props = {
  children: React.ReactNode;
};

export function ManageOthersCollaboratorsProtectedRoute({ children }: Props) {
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

export function ManageAutomationsProtectedRoute({ children }: Props) {
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
