import { Edit, MoreHorizontal, Trash } from "lucide-react";

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
import { DeleteOperation } from "@/services/api";

import React from "react";
import { useSearchParams } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OperationDropdown({ row }: any) {
  const [dialog, setDialog] = React.useState(false);

  const [, setSearchParams] = useSearchParams();

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
            onClick={() =>
              setSearchParams({ editarOperacao: row.getValue("id") })
            }
          >
            <Edit className="w-4 h-4 mr-2 " />
            Editar operação
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDialog(true)}
            className="text-red-700 hover:text-red-700 font-medium "
          >
            <Trash className="w-4 h-4 mr-2 " />
            Remover operação
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>
      <AlertDialog open={dialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação</AlertDialogTitle>
            <AlertDialogDescription className="text-red-600">
              Deseja mesmo remover esta operação? Está ação não pode ser
              desfeita
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
                  DeleteOperation(row.getValue("id"));
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
