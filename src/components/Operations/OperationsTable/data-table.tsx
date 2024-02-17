"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PlusCircle,
  X,
} from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import NewOperationForm from "@/components/Forms/NewOperationForm";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [date, setDate] = React.useState<DateRange | undefined>();

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
      columnFilters,
    },
    columnResizeMode: "onChange",
  });

  return (
    <div>
      <div className="flex items-center justify-between py-2">
        <div className="flex gap-2 items-center">
          <span className="font-medium mr-1">Filtros</span>
          <Input
            placeholder="Nome do cliente"
            value={
              (table.getColumn("cliente")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("cliente")?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-64"
          />
          <Select
            value={
              (table
                .getColumn("statusDaOperacao")
                ?.getFilterValue() as string) ?? ""
            }
            onValueChange={(event) =>
              table.getColumn("statusDaOperacao")?.setFilterValue(event)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="1">Sucesso</SelectItem>
                <SelectItem value="2">Processando</SelectItem>
                <SelectItem value="3">Pendente</SelectItem>
                <SelectItem value="4">Falha</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn("tipoDaOperacao")?.getFilterValue() as string) ??
              ""
            }
            onValueChange={(event) =>
              table.getColumn("tipoDaOperacao")?.setFilterValue(event)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo</SelectLabel>
                <SelectItem value="fgts">FGTS</SelectItem>
                <SelectItem value="gov">GOV</SelectItem>
                <SelectItem value="prefeitura">PREFEITURA</SelectItem>
                <SelectItem value="inss">INSS</SelectItem>
                <SelectItem value="bolsa-familia">BOLSA FAMÍLIA</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn("promotora")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(event) =>
              table.getColumn("promotora")?.setFilterValue(event)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Promotora" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Promotora</SelectLabel>
                <SelectItem value="inove">Inove</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Data da operação</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                selected={date}
                defaultMonth={date?.from}
                onSelect={(e) => {
                  table
                    .getColumn("dataDaOperacao")
                    ?.setFilterValue([e?.from, e?.to]);
                  setDate(e);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            className="px-3 text-red-600 hover:text-red-800 hover:bg-red-50"
            onClick={() => {
              console.log(date?.from?.getTime());
              table.getColumn("statusDaOperacao")?.setFilterValue("");
              table.getColumn("tipoDaOperacao")?.setFilterValue("");
              table.getColumn("cliente")?.setFilterValue("");
              table.getColumn("promotora")?.setFilterValue("");
              setDate(undefined);
            }}
          >
            <X className="h-4 w-4 mr-2 " />
            Limpar filtros
          </Button>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Nova operação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <NewOperationForm />
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div>
        <div className="flex items-center justify-end space-x-2 py-2">
          <span className="text-sm  ml-2 p-0 text-slate-700">
            Página{" "}
            <span className="font-bold">
              {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>
          </span>
          <Input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            max={2}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-10 h-9"
          />
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
  );
}
