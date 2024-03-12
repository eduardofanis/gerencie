"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  PlusCircle,
  ChevronDown,
  Download,
  Upload,
} from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import NewCostumerForm from "@/components/Forms/NewCostumerForm";
import { useSearchParams } from "react-router-dom";
import EditCostumerForm from "@/components/Forms/EditCostumerForm";

import { SelectItems } from "@/components/Forms/Input/SelectInput";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import * as XLSX from "xlsx";
import { CostumerProps } from "../CostumersView";
import { CollaboratorContext } from "@/contexts/CollaboratorContext";
import { SubscriberContext } from "@/contexts/SubscriberContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDataProps } from "@/types/UserDataProps";
import { toast } from "@/components/ui/use-toast";
import { NewCostumer } from "@/services/api";
import { z } from "zod";
import { CostumerSchema } from "@/schemas/CostumerSchema";

const estados: SelectItems[] = [
  { value: "AC", label: "AC" },
  { value: "AL", label: "AL" },
  { value: "AP", label: "AP" },
  { value: "AM", label: "AM" },
  { value: "BA", label: "BA" },
  { value: "CE", label: "CE" },
  { value: "DF", label: "DF" },
  { value: "ES", label: "ES" },
  { value: "GO", label: "GO" },
  { value: "MA", label: "MA" },
  { value: "MT", label: "MT" },
  { value: "MS", label: "MS" },
  { value: "MG", label: "MG" },
  { value: "PA", label: "PA" },
  { value: "PB", label: "PB" },
  { value: "PR", label: "PR" },
  { value: "PE", label: "PE" },
  { value: "PI", label: "PI" },
  { value: "RJ", label: "RJ" },
  { value: "RN", label: "RN" },
  { value: "RS", label: "RS" },
  { value: "RO", label: "RO" },
  { value: "RR", label: "RR" },
  { value: "SC", label: "SC" },
  { value: "SP", label: "SP" },
  { value: "SE", label: "SE" },
  { value: "TO", label: "TO" },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  collaborators: UserDataProps[];
}

export function CostumersDataTable<TData, TValue>({
  columns,
  data,
  collaborators,
}: DataTableProps<TData, TValue>) {
  const { collaborator } = React.useContext(CollaboratorContext);
  const { subscriber } = React.useContext(SubscriberContext);

  const permission =
    !collaborator && subscriber?.plano !== "Individual"
      ? true
      : collaborator &&
        collaborator.permissions.gerenciarClientesDeOutros === true
      ? true
      : false;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: false,
      criadoPor: permission,
    });
  const [searchParams, setSearchParams] = useSearchParams();
  const [openEstados, setOpenEstados] = React.useState(false);

  const importInputRef = React.useRef<HTMLInputElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    onColumnVisibilityChange: setColumnVisibility,
    columnResizeMode: "onChange",
  });

  function handleExport() {
    const data2 = data as CostumerProps[];
    const costumerData = data2.map((item) => {
      return {
        nome: item.nome,
        cpfRg: item.cpfRg,
        dataDeNascimento: item.dataDeNascimento
          .toDate()
          .toLocaleDateString("pt-BR"),
        sexo: item.sexo,
        estadoCivil: item.estadoCivil,
        naturalidade: item.naturalidade,
        telefone: item.telefone,
        cep: item.cep,
        rua: item.rua,
        numeroDaRua: item.numeroDaRua,
        complemento: item.complemento,
        cidade: item.cidade,
        bairro: item.bairro,
        estado: item.estado,
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(costumerData);

    XLSX.utils.book_append_sheet(wb, ws, "Tabela de Clientes");

    XLSX.writeFile(wb, "Tabela de Clientes.xlsx");
  }

  function handleImportClick() {
    importInputRef.current?.click();
  }

  function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsBinaryString(event.target.files[0]);

      reader.onload = function (e) {
        const data = e.target?.result;

        const wb = XLSX.read(data, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const json = XLSX.utils.sheet_to_json(ws) as z.infer<
          typeof CostumerSchema
        >[];
        console.log(json);
        console.log(verifyProperties(json));
        if (verifyProperties(json)) {
          try {
            json.forEach((item) => {
              NewCostumer(item);
            });
            toast({
              title: "Clientes importados com sucesso!",
              variant: "success",
              duration: 5000,
            });
          } catch (error) {
            toast({
              title: "Algo deu errado, tente novamente!",
              variant: "destructive",
              duration: 5000,
            });
          }
        } else {
          toast({
            title: "Formato inválido, verifique e tente novamente!",
            variant: "destructive",
            duration: 5000,
          });
        }
      };
    }
  }

  function verifyProperties(costumersArray: z.infer<typeof CostumerSchema>[]) {
    try {
      costumersArray.forEach((costumer) => {
        CostumerSchema.parse(costumer);
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex gap-2 min-[1400px]:hidden"
              variant="outline"
            >
              Filtros <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="p-4 grid grid-cols-2 gap-2 w-[320px]"
            align="start"
          >
            <Input
              placeholder="Nome do cliente"
              value={
                (table.getColumn("nome")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("nome")?.setFilterValue(event.target.value);
              }}
              className="col-span-2"
            />
            {permission && (
              <Select
                value={
                  (table.getColumn("criadoPor")?.getFilterValue() as string) ??
                  ""
                }
                onValueChange={(event) => {
                  table.getColumn("criadoPor")?.setFilterValue(event);
                }}
              >
                <SelectTrigger
                  className={`col-span-2 ${
                    !table.getColumn("criadoPor")?.getFilterValue() &&
                    "text-slate-500"
                  } font-normal`}
                >
                  <SelectValue placeholder="Criado por"></SelectValue>
                </SelectTrigger>
                <SelectContent className="">
                  <SelectGroup>
                    {collaborators && collaborators.length > 0 ? (
                      collaborators.map((collaborator) => (
                        <SelectItem
                          value={collaborator.id}
                          key={collaborator.id}
                        >
                          <div className="flex gap-3 items-center">
                            <Avatar className="size-6">
                              <AvatarImage src={collaborator.avatar} />
                              <AvatarFallback className="bg-slate-50">
                                {collaborator.nome.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {collaborator.nome}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-sm text-center my-2">
                        Nenhum colaborador encontrado
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            <Input
              placeholder="Telefone"
              value={
                (table.getColumn("telefone")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("telefone")?.setFilterValue(event.target.value);
              }}
            />

            <Popover open={openEstados} onOpenChange={setOpenEstados}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openEstados}
                  className={`justify-between  ${
                    !table.getColumn("estado")?.getFilterValue() &&
                    "text-slate-500"
                  } font-normal`}
                >
                  {table.getColumn("estado")?.getFilterValue()
                    ? (
                        table.getColumn("estado")?.getFilterValue() as string
                      ).toUpperCase()
                    : "Estado"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[140px]">
                <Command>
                  <CommandInput placeholder="Pesquisar" className="h-9" />
                  <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[180px]">
                      {estados.map((estado) => (
                        <CommandItem
                          key={estado.value}
                          value={estado.value}
                          onSelect={(currentValue: string) => {
                            table
                              .getColumn("estado")
                              ?.setFilterValue(currentValue);
                            setOpenEstados(false);
                          }}
                        >
                          {estado.label}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:text-red-800 hover:bg-red-50 col-span-2"
              onClick={() => {
                table.getColumn("nome")?.setFilterValue("");
                table.getColumn("telefone")?.setFilterValue("");
                table.getColumn("estado")?.setFilterValue("");
                table.getColumn("criadoPor")?.setFilterValue("");
              }}
            >
              <X className="h-4 w-4 mr-2 " />
              Limpar filtros
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden min-[1400px]:flex gap-2 items-center">
          <Input
            placeholder="Nome do cliente"
            value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("nome")?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-[300px]"
          />
          <Input
            placeholder="Telefone"
            value={
              (table.getColumn("telefone")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("telefone")?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-40"
          />

          <Popover open={openEstados} onOpenChange={setOpenEstados}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openEstados}
                className={`w-[160px] justify-between  ${
                  !table.getColumn("estado")?.getFilterValue() &&
                  "text-slate-500"
                } font-normal`}
              >
                {table.getColumn("estado")?.getFilterValue()
                  ? (
                      table.getColumn("estado")?.getFilterValue() as string
                    ).toUpperCase()
                  : "Estado"}

                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[160px] p-0">
              <Command>
                <CommandInput placeholder="Pesquisar" className="h-9" />
                <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[180px]">
                    {estados.map((estado) => (
                      <CommandItem
                        key={estado.value}
                        value={estado.value}
                        onSelect={(currentValue: string) => {
                          table
                            .getColumn("estado")
                            ?.setFilterValue(currentValue);
                          setOpenEstados(false);
                        }}
                      >
                        {estado.label}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          {permission && (
            <Select
              value={
                (table.getColumn("criadoPor")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(event) =>
                table.getColumn("criadoPor")?.setFilterValue(event)
              }
            >
              <SelectTrigger
                className={`w-[240px] ${
                  !table.getColumn("criadoPor")?.getFilterValue() &&
                  "text-slate-500"
                } font-normal`}
              >
                <SelectValue placeholder="Criado por"></SelectValue>
              </SelectTrigger>
              <SelectContent className="w-[300px]">
                <SelectGroup>
                  {collaborators && collaborators.length > 0 ? (
                    collaborators.map((collaborator) => (
                      <SelectItem value={collaborator.id} key={collaborator.id}>
                        <div className="flex gap-3 items-center">
                          <Avatar className="size-6">
                            <AvatarImage src={collaborator.avatar} />
                            <AvatarFallback className="bg-slate-50">
                              {collaborator.nome.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {collaborator.nome}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="text-sm text-center my-2">
                      Nenhum colaborador encontrado
                    </div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:text-red-800 hover:bg-red-50"
            onClick={() => {
              table.getColumn("nome")?.setFilterValue("");
              table.getColumn("telefone")?.setFilterValue("");
              table.getColumn("estado")?.setFilterValue("");
              table.getColumn("criadoPor")?.setFilterValue("");
            }}
          >
            <X className="h-4 w-4 mr-2 " />
            Limpar filtros
          </Button>
        </div>

        <Dialog
          open={
            searchParams.get("novoCliente") || searchParams.get("editarCliente")
              ? true
              : false
          }
        >
          <DialogTrigger asChild>
            <Button onClick={() => setSearchParams({ novoCliente: "true" })}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            {!searchParams.get("editarCliente") ? (
              <NewCostumerForm />
            ) : (
              <EditCostumerForm />
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 text-center"
                >
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => handleExport()}>
              <Download className="size-4 mr-2" />
              Exportar dados
            </Button>
            <Button variant="secondary" onClick={() => handleImportClick()}>
              <Upload className="size-4 mr-2" />
              Importar dados
            </Button>
            <Input
              type="file"
              className="hidden"
              accept=".csv, .xlsx, .xls"
              onChange={handleImport}
              ref={importInputRef}
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm  ml-2 p-0 text-slate-700">
              Página{" "}
              <span className="font-bold">
                {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
