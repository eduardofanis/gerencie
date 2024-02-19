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
import { DeleteCostumer } from "@/api";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DropdownMenu({ row }: any) {
  const [dialog, setDialog] = React.useState(false);

  return (
    <div className="flex justify-end items-center">
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
      <AlertDialog open={dialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja remover todos as operações relacionadas a este cliente?
              (clicando em manter, o cliente ainda é removido mas as operações
              relacionadas serão mantidas)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                DeleteCostumer(row.getValue("id"), false);
                setDialog(false);
              }}
            >
              Manter operações
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                DeleteCostumer(row.getValue("id"), true);
                setDialog(false);
              }}
            >
              Apagar operações
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
