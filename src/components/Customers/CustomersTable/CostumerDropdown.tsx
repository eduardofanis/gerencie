import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

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
import { DeleteCostumer } from "@/api";
import { Switch } from "@/components/ui/switch";

import React from "react";
import { useSearchParams } from "react-router-dom";
import CostumersView from "../CostumersView";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CostumerDropdown({ row }: any) {
  const [dialog, setDialog] = React.useState(false);
  const [remove, setRemove] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();

  const clienteId = row.getValue("id").split("-").slice(1).join("-");

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
            onClick={() => setSearchParams({ visualizarCliente: clienteId })}
          >
            <Eye className="w-4 h-4 mr-2 " />
            Visualizar cliente
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="w-4 h-4 mr-2 " />
            Editar cliente
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDialog(true)}
            className="text-red-700 hover:text-red-700 font-medium "
          >
            <Trash className="w-4 h-4 mr-2 " />
            Remover cliente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>
      <CostumersView />
      <AlertDialog open={dialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p className="text-red-600">
                  Deseja mesmo remover este cliente? Está ação não pode ser
                  desfeita
                </p>
                <div className="flex items-center justify-between border  p-2 rounded-md">
                  <p>Remover as operações relacionadas a este cliente?</p>
                  <Switch
                    className="bg-red-400"
                    checked={remove}
                    onCheckedChange={() => setRemove(!remove)}
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  DeleteCostumer(row.getValue("id"), remove);
                  setDialog(false);
                }}
              >
                Remover
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
