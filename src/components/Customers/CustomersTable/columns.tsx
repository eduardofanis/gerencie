"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { z } from "zod";
import { NewCostumerFormSchema } from "@/schemas/NewCostumerFormSchema";
import { DeleteCostumer } from "@/api";
import React from "react";

export const columns: ColumnDef<z.infer<typeof NewCostumerFormSchema>>[] = [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="ml-4">{row.getValue("nome")}</div>;
    },
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {row.getValue("telefone")}
          {/* <Button
            className="p-0 ml-2"
            variant={"link"}
            onClick={() =>
              navigator.clipboard.writeText(row.getValue("telefone"))
            }
          >
            <ClipboardCopy className="h-4 w-4 text-slate-700" />
          </Button> */}
        </div>
      );
    },
  },
  {
    accessorKey: "dataDeNascimento",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de nascimento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("dataDeNascimento"));
      const formatted = date.toLocaleDateString("pt-BR");

      return <div className="ml-4">{formatted}</div>;
    },
  },
  {
    accessorKey: "ultimaOperacao",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Última operação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value: string = row.getValue("ultimaOperacao");
      const date = new Date(value);
      const formatted = date.toLocaleDateString("pt-BR");

      if (!value) return <div className="ml-4">Nenhuma operação.</div>;
      return <div className="ml-4">{formatted}</div>;
    },
  },
  {
    accessorKey: "valorTotalLiberado",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Valor total liberado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(
        row.getValue("valorTotalLiberado")
          ? row.getValue("valorTotalLiberado")
          : "0"
      );
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="text-right font-medium mr-4">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [dialog, setDialog] = React.useState(false);

      return (
        <div className="flex justify-end items-center">
          <DropdownMenu>
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
          </DropdownMenu>
          <AlertDialog open={dialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmação</AlertDialogTitle>
                <AlertDialogDescription>
                  Deseja remover todos as operações relacionadas a este cliente?
                  (clicando em manter, o cliente ainda é removido mas as
                  operações relacionadas são mantidas)
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
    },
  },
];
