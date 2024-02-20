"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { NewOperationFormSchema } from "@/schemas/NewOperationFormSchema";
import { z } from "zod";
import { Timestamp } from "firebase/firestore";
import OperationDropdown from "./OperationDropdown";

export type Operation = {
  statusDaOperacao: string;
  cliente: string;
  clienteID: string;
  tipoDaOperacao: string;
  promotora: string;
  dataDaOperacao: number;
  valorRecebido: number;
  valorLiberado: number;
};

export const columns: ColumnDef<z.infer<typeof NewOperationFormSchema>>[] = [
  {
    accessorKey: "id",
    header: "",
    cell: "",
  },
  {
    accessorKey: "statusDaOperacao",
    header: () => <div className="ml-4">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("statusDaOperacao");

      switch (status) {
        case "1":
          return (
            <div className="text-green-600 font-medium flex items-center ml-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Sucesso
            </div>
          );
        case "2":
          return (
            <div className="text-yellow-600 font-medium flex items-center ml-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Processando
            </div>
          );
        case "3":
          return (
            <div className="text-orange-600 font-medium flex items-center ml-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Pendente
            </div>
          );
        case "4":
          return (
            <div className="text-red-600 font-medium flex items-center ml-4">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Falha
            </div>
          );
      }
    },
  },
  {
    accessorKey: "cliente",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cliente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="ml-4">{row.getValue("cliente")}</div>;
    },
  },
  {
    accessorKey: "tipoDaOperacao",
    header: "Tipo",
    cell: ({ row }) => {
      const type: string = row.getValue("tipoDaOperacao");
      return (
        <Badge
          className={
            type == "fgts"
              ? "bg-sky-600"
              : type == "gov"
              ? "bg-green-600"
              : type == "inss"
              ? "bg-yellow-600"
              : "bg-indigo-600"
          }
        >
          {type.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "promotora",
    header: "Promotora",
  },
  {
    accessorKey: "dataDaOperacao",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data da operação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateRow: Timestamp = row.getValue("dataDaOperacao");
      const date = dateRow.toDate();
      console.log(row.getValue("dataDaOperacao"));
      const formatted = date.toLocaleDateString("pt-BR");

      return <div className="ml-4">{formatted}</div>;
    },
  },

  {
    accessorKey: "valorRecebido",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Valor recebido
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("valorRecebido"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return (
        <div className="text-right font-medium mr-4 text-green-600">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "valorLiberado",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Valor liberado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("valorLiberado"));
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
      return <OperationDropdown row={row} />;
    },
  },
];
