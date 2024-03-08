import { PermissionsProps } from "./UserDataProps";

export type CollaboratorProps = {
  avatar: string;
  id: string;
  name: string;
  telefone: string;
  email: string;
  permissoes: PermissionsProps;
};
