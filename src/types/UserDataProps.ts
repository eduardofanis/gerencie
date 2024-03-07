import { OperationType } from "@/components/Forms/NewOperationTypeForm";
import { Timestamp } from "firebase/firestore";

export type CollaboratorProps = {
  uid: string;
};

export type PermissionsProps = {
  visaoEstatisticasDeTodos: boolean;
  gerenciarOperacoesClientesDeOutros: boolean;
  gerenciarTipoDeOperacoes: boolean;
  gerenciarColaboradores: boolean;
  gerenciarAutomacoes: boolean;
};

export type UserDataProps = {
  tiposDeOperacoes?: OperationType[];
  dataDeVencimento?: Timestamp;
  plano: "Individual" | "Empresarial" | "Time";
  id: string;
  gerenteUid?: string;
  avatar: string;
  nome: string;
  email: string;
  telefone: string;
  colaboradores?: CollaboratorProps[];
  permissoes: PermissionsProps;
};
