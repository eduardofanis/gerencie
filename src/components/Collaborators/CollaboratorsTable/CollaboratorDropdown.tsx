import { MoreHorizontal, Settings2, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React from "react";
import { DeleteCollaborator } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { firebaseApp } from "@/main";
import { UserDataProps } from "@/types/UserDataProps";
import { toast } from "@/components/ui/use-toast";
import { SubscriberContext } from "@/contexts/SubscriberContext";

interface CollaboratorPermissionsDialogProps {
  id: string;
  name: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DeleteCollaboratorDialogProps {
  id: string;
  email: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

function CollaboratorPermissionsDialog({
  id,
  name,
  open,
  setOpen,
}: CollaboratorPermissionsDialogProps) {
  const [visaoEstatisticasDeTodos, setVisaoEstatisticasDeTodos] =
    React.useState(false);
  const [gerenciarOperacoesDeOutros, setGerenciarOperacoesDeOutros] =
    React.useState(false);
  const [gerenciarClientesDeOutros, setGerenciarClientesDeOutros] =
    React.useState(false);
  const [gerenciarTipoDeOperacoes, setGerenciarTipoDeOperacoes] =
    React.useState(false);
  const [gerenciarColaboradores, setGerenciarColaboradores] =
    React.useState(false);
  const [gerenciarAutomacoes, setGerenciarAutomacoes] = React.useState(false);

  const { subscriber } = React.useContext(SubscriberContext);

  async function handleUpdatePermissions() {
    const db = getFirestore(firebaseApp);

    try {
      await updateDoc(doc(db, id, "data"), {
        permissoes: {
          visaoEstatisticasDeTodos: visaoEstatisticasDeTodos,
          gerenciarOperacoesDeOutros: gerenciarOperacoesDeOutros,
          gerenciarClientesDeOutros: gerenciarClientesDeOutros,
          gerenciarTipoDeOperacoes: gerenciarTipoDeOperacoes,
          gerenciarColaboradores: gerenciarColaboradores,
          gerenciarAutomacoes: gerenciarAutomacoes,
        },
      });
      toast({
        title: "Permissões alteradas.",
        description: "Permissões alteradas com sucesso.",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Algo deu errado.",
        description: "Ocorreu um erro ao alterar as permissoes.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setOpen(false);
    }
  }

  React.useEffect(() => {
    async function setPermissions() {
      if (open) {
        const db = getFirestore(firebaseApp);
        const data = (
          await getDoc(doc(db, id, "data"))
        ).data() as UserDataProps;

        if (data && data.permissoes) {
          setVisaoEstatisticasDeTodos(data.permissoes.visaoEstatisticasDeTodos);
          setGerenciarOperacoesDeOutros(
            data.permissoes.gerenciarOperacoesDeOutros
          );
          setGerenciarClientesDeOutros(
            data.permissoes.gerenciarClientesDeOutros
          );
          setGerenciarTipoDeOperacoes(data.permissoes.gerenciarTipoDeOperacoes);
          setGerenciarColaboradores(data.permissoes.gerenciarColaboradores);
          setGerenciarAutomacoes(data.permissoes.gerenciarAutomacoes);
        }
      }
    }
    setPermissions();
  }, [open, id]);

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permissões de {name}</DialogTitle>
          <DialogDescription>
            Altere as permissões que deseja e clique em salvar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 divide-y mt-4">
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <h4 className="text-medium ">Visão completa das estatisticas</h4>
              <p className="text-sm opacity-85">
                Visualizar Receita/Operações/Clientes de todos.
              </p>
            </div>
            <Switch
              checked={visaoEstatisticasDeTodos}
              onCheckedChange={() =>
                setVisaoEstatisticasDeTodos(!visaoEstatisticasDeTodos)
              }
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <h4 className="text-medium ">Gerenciar operações de outros</h4>
              <p className="text-sm opacity-85">
                Visualizar, adicionar, remover e editar.
              </p>
            </div>
            <Switch
              checked={gerenciarOperacoesDeOutros}
              onCheckedChange={() =>
                setGerenciarOperacoesDeOutros(!gerenciarOperacoesDeOutros)
              }
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <h4 className="text-medium ">Gerenciar clientes de outros</h4>
              <p className="text-sm opacity-85">
                Visualizar, adicionar, remover e editar.
              </p>
            </div>
            <Switch
              checked={gerenciarClientesDeOutros}
              onCheckedChange={() =>
                setGerenciarClientesDeOutros(!gerenciarClientesDeOutros)
              }
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <h4 className="text-medium ">Gerenciar tipos de operações</h4>
              <p className="text-sm opacity-85">Adicionar e remover.</p>
            </div>
            <Switch
              checked={gerenciarTipoDeOperacoes}
              onCheckedChange={() =>
                setGerenciarTipoDeOperacoes(!gerenciarTipoDeOperacoes)
              }
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <h4 className="text-medium ">Gerenciar colaboradores</h4>
              <p className="text-sm opacity-85">
                Adicionar, remover e alterar permissões.
              </p>
            </div>
            <Switch
              checked={gerenciarColaboradores}
              onCheckedChange={() =>
                setGerenciarColaboradores(!gerenciarColaboradores)
              }
            />
          </div>
          {subscriber?.plano === "Empresarial" && (
            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-col">
                <h4 className="text-medium ">Gerenciar automações</h4>
                <p className="text-sm opacity-85">
                  Adicionar, remover e editar.
                </p>
              </div>
              <Switch
                checked={gerenciarAutomacoes}
                onCheckedChange={() =>
                  setGerenciarAutomacoes(!gerenciarAutomacoes)
                }
              />
            </div>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button
            variant={"outline"}
            className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleUpdatePermissions}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteCollaboratorDialog({
  id,
  email,
  open,
  setOpen,
  password,
  setPassword,
}: DeleteCollaboratorDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmação</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="text-red-600">
                Deseja mesmo remover este colaborador? Está ação não pode ser
                desfeita!
              </p>
              <Input
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Insira a senha do colaborador"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                DeleteCollaborator(id, email, password);
                setOpen(false);
              }}
            >
              Remover
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CollaboratorDropdown({ row }: any) {
  const [dialog, setDialog] = React.useState(false);
  const [permissionsDialog, setPermissionsDialog] = React.useState(false);
  const [password, setPassword] = React.useState("");

  return (
    <div className="flex justify-end items-center">
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setPermissionsDialog(true);
            }}
          >
            <Settings2 className="w-4 h-4 mr-2 " />
            Gerenciar permissões
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setDialog(true);
              setPassword("");
            }}
            className="text-red-700 hover:text-red-700 font-medium "
          >
            <Trash className="w-4 h-4 mr-2 " />
            Remover colaborador
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>

      <DeleteCollaboratorDialog
        id={row.getValue("id")}
        email={row.getValue("email")}
        open={dialog}
        setOpen={setDialog}
        password={password}
        setPassword={setPassword}
      />

      <CollaboratorPermissionsDialog
        id={row.getValue("id")}
        name={row.getValue("nome")}
        open={permissionsDialog}
        setOpen={setPermissionsDialog}
      />
    </div>
  );
}
