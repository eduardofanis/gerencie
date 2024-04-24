"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CostumerSchema } from "@/schemas/CostumerSchema";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";
import CreatedBy from "../../ui/CreatedBy";
import CostumerDropdown from "./CostumerDropdown";

export const CostumersTableColumns: ColumnDef<
  z.infer<typeof CostumerSchema>
>[] = [
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
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="ml-4 text-ellipsis max-w-28 truncate">
                {row.getValue("nome")}
              </div>
            </TooltipTrigger>
            <TooltipContent align="start">
              {row.getValue("nome")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    cell: ({ row }) => {
      const value = row.getValue("cpf") as string;
      const formatted = value?.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      );

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
    cell: ({ row }) => {
      const value = row.getValue("telefone") as string;
      const formatted =
        value?.length === 10
          ? value?.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
          : value?.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

      return <div className="flex items-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
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
      const { seconds } = row.getValue("dataDeNascimento") as Timestamp;
      const milliseconds = seconds * 1000;
      const date = new Date(milliseconds).toLocaleDateString("pt-BR");

      return <div className="ml-4">{date}</div>;
    },
  },
  {
    accessorKey: "criadoPor",
    header: "Criado por",
    cell: ({ row }) => {
      const id = row.getValue("criadoPor") as string;

      return <CreatedBy id={id} />;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <CostumerDropdown row={row} />;
    },
  },
];
