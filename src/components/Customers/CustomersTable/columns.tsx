"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { z } from "zod";
import { CostumerSchema } from "@/schemas/CostumerSchema";
import CostumerDropdown from "./CostumerDropdown";
import { Timestamp } from "firebase/firestore";

export const columns: ColumnDef<z.infer<typeof CostumerSchema>>[] = [
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
      const value = row.getValue("telefone") as string;
      const formatted = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

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
      return <CostumerDropdown row={row} />;
    },
  },
];
