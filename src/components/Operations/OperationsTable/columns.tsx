"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { OperationSchema } from "@/schemas/OperationSchema";
import { z } from "zod";
import { Timestamp } from "firebase/firestore";
import OperationDropdown from "./OperationDropdown";
import { getUserData } from "@/services/api";

export const columns: ColumnDef<z.infer<typeof OperationSchema>>[] = [
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
        case "concluido":
          return (
            <div className="text-green-600 font-medium flex items-center ml-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Concluido
            </div>
          );
        case "processando":
          return (
            <div className="text-yellow-600 font-medium flex items-center ml-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Processando
            </div>
          );
        case "pendente":
          return (
            <div className="text-orange-600 font-medium flex items-center ml-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Pendente
            </div>
          );
        case "falha":
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
      let backgroundColor = "#000000";
      const type: string = row.getValue("tipoDaOperacao");
      const formattedType = type.toLowerCase().replace(/\s+/g, "-");

      getUserData().then((data) => {
        const tipoOperacao = data?.tiposDeOperacoes.find(
          (tipo) => tipo.name === type
        );
        if (tipoOperacao) {
          backgroundColor = tipoOperacao.color;
          updateBadgeStyle(backgroundColor, formattedType);
        }
      });

      const updateBadgeStyle = (backgroundColor: string, type: string) => {
        const badgeElements = document.querySelectorAll(`.badge-${type}`);
        badgeElements.forEach((badgeElement) => {
          if (badgeElement instanceof HTMLElement) {
            badgeElement.style.backgroundColor = backgroundColor;
          }
        });
      };

      return (
        <Badge
          id={`badge-${formattedType}`}
          className={`badge badge-${formattedType}`}
          style={{ backgroundColor: backgroundColor }}
        >
          {type.toUpperCase()}
        </Badge>
      );
    },
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
      const formatted = date.toLocaleDateString("pt-BR");

      return <div className="ml-4">{formatted}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Criado em
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateRow: Timestamp = row.getValue("createdAt");

      function formatTime(time: Timestamp) {
        const agora = Timestamp.now().toMillis(); // Obtém o timestamp atual do Firebase em milissegundos
        const timestamp = time.toMillis(); // Obtém o timestamp fornecido em milissegundos

        const diferenca = agora - timestamp;

        const segundos = Math.floor(diferenca / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const dias = Math.floor(horas / 24);

        if (dias > 0) {
          return `Há ${dias} dia${dias > 1 ? "s" : ""} atrás`;
        } else if (horas > 0) {
          return `Há ${horas} hora${horas > 1 ? "s" : ""} atrás`;
        } else if (minutos > 0) {
          return `Há ${minutos} minuto${minutos > 1 ? "s" : ""} atrás`;
        } else {
          return `Há poucos segundos atrás`;
        }
      }

      return <div className="ml-4">{formatTime(dateRow)}</div>;
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
