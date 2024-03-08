"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { OperationSchema } from "@/schemas/OperationSchema";
import { z } from "zod";
import { Timestamp } from "firebase/firestore";
import OperationDropdown from "./OperationDropdown";
import { getUserData } from "@/services/user";

import OperationCreatedBy from "./OperationCreatedBy";
import OperationSelectStatus from "./OperationSelectStatus";

export const OperationsTableColumns: ColumnDef<
  z.infer<typeof OperationSchema>
>[] = [
  {
    accessorKey: "id",
    header: "",
    cell: "",
  },
  {
    accessorKey: "statusDaOperacao",
    header: () => <div className="ml-4">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("statusDaOperacao") as string;
      const id = row.getValue("id") as string;

      return <OperationSelectStatus id={id} status={status} />;
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
        const tipoOperacao = data?.tiposDeOperacoes?.find(
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
    accessorKey: "criadoPor",
    header: "Criado por",
    cell: ({ row }) => {
      const id = row.getValue("criadoPor") as string;

      return <OperationCreatedBy id={id} />;
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
          Data
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
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Criado há
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const dateRow: Timestamp = row.getValue("createdAt");

  //     function formatTime(time: Timestamp) {
  //       const agora = Timestamp.now().toMillis(); // Obtém o timestamp atual do Firebase em milissegundos
  //       const timestamp = time.toMillis(); // Obtém o timestamp fornecido em milissegundos

  //       const diferenca = agora - timestamp;

  //       const segundos = Math.floor(diferenca / 1000);
  //       const minutos = Math.floor(segundos / 60);
  //       const horas = Math.floor(minutos / 60);
  //       const dias = Math.floor(horas / 24);

  //       if (dias > 0) {
  //         return `${dias} dia${dias > 1 ? "s" : ""} atrás`;
  //       } else if (horas > 0) {
  //         return `${horas} hora${horas > 1 ? "s" : ""} atrás`;
  //       } else if (minutos > 0) {
  //         return `${minutos} minuto${minutos > 1 ? "s" : ""} atrás`;
  //       } else {
  //         return `Poucos segundos atrás`;
  //       }
  //     }

  //     return <div className="ml-4">{formatTime(dateRow)}</div>;
  //   },
  // },
  {
    accessorKey: "valorRecebido",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Comissão
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
            Valor
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

      const amount2 = parseFloat(row.getValue("valorRecebido"));
      const formatted2 = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount2);

      return (
        <div className="text-right font-medium mr-4 flex flex-col">
          <span>{formatted}</span>
          <span className="text-green-600">{formatted2}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <OperationDropdown row={row} />;
    },
  },
];
