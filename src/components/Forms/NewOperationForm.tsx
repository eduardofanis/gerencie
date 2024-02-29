import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Plus,
} from "lucide-react";
import { GetCostumers, NewOperation } from "@/services/api";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MoneyInput from "./Input/MoneyInput";
import { OperationSchema } from "@/schemas/OperationSchema";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { useSearchParams } from "react-router-dom";
import { Separator } from "../ui/separator";
import NewOperationTypeForm, { UserDataProps } from "./NewOperationTypeForm";
import { firebaseApp } from "@/main";
import { getAuth } from "firebase/auth";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";
import NumberInput from "./Input/NumberInput";
import SelectInput, { SelectItems } from "./Input/SelectInput";
import { CostumerSchema } from "@/schemas/CostumerSchema";

const StatusList: SelectItems[] = [
  {
    value: "concluido",
    label: "Concluído",
  },
  {
    value: "processando",
    label: "Processando",
  },
  {
    value: "pendente",
    label: "Pendente",
  },
  {
    value: "falha",
    label: "Falha",
  },
];

export default function NewOperationForm() {
  const [data, setData] = React.useState<z.infer<typeof CostumerSchema>[]>();
  const [nomeDoCliente, setNomeDoCliente] = React.useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();
  const [operationTypes, setOperationTypes] =
    React.useState<UserDataProps | null>(null);

  const form = useForm<z.infer<typeof OperationSchema>>({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      clienteId: "",
      tipoDaOperacao: "",
      statusDaOperacao: "",
      valorLiberado: 0,
      comissao: "",
      dataDaOperacao: new Date(),
    },
  });
  function onSubmit(values: z.infer<typeof OperationSchema>) {
    NewOperation(values, nomeDoCliente);
    setSearchParams({ operationModal: "false" });
  }

  React.useEffect(() => {
    async function getCostumers() {
      const costumers = await GetCostumers();
      setData(costumers);
    }
    getCostumers();
  }, []);

  React.useEffect(() => {
    const db = getFirestore(firebaseApp);
    const { currentUser } = getAuth(firebaseApp);

    const unsubscribe = onSnapshot(
      doc(db, currentUser!.uid, "data"),
      (docSnapshot) => {
        setOperationTypes(docSnapshot.data() as UserDataProps);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Cadastrar nova operação</DialogTitle>
        <DialogDescription>
          Preencha todos os campos e clique em cadastrar em seguida.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="justify-between w-full p-3 font-normal"
                          >
                            {field.value && data
                              ? data.find(
                                  (language) => language.id === field.value
                                )?.nome
                              : "Selecione um cliente"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Pesquisar cliente..." />
                          <CommandEmpty>
                            Nenhum cliente encontrado.
                          </CommandEmpty>
                          <CommandGroup>
                            <ScrollArea className="max-h-[400px]">
                              {data !== undefined &&
                                data.map(
                                  (cliente: z.infer<typeof CostumerSchema>) => (
                                    <CommandItem
                                      value={cliente.id}
                                      key={cliente.id}
                                      onSelect={() => {
                                        form.setValue(
                                          "clienteId",
                                          cliente.id ? cliente.id : ""
                                        );
                                        setNomeDoCliente(cliente.nome);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          cliente.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {cliente.nome}
                                    </CommandItem>
                                  )
                                )}
                            </ScrollArea>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tipoDaOperacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo da operação</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full flex justify-between"
                          >
                            Adicionar novo tipo
                            <Plus className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <NewOperationTypeForm />
                      </Dialog>

                      <Separator className="mb-2" />

                      {operationTypes &&
                      operationTypes.tiposDeOperacoes &&
                      operationTypes.tiposDeOperacoes.length > 0 ? (
                        operationTypes.tiposDeOperacoes.map((tipo) => (
                          <SelectItem
                            value={tipo.name}
                            key={`${tipo.color}-${tipo.name}`}
                          >
                            {tipo.name.toUpperCase()}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-sm text-center my-2">
                          Nenhum tipo encontrado
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <SelectInput
              name="statusDaOperacao"
              form={form}
              label="Status da operação"
              selectItems={StatusList}
              placeholder="Selecione"
            />

            <FormField
              control={form.control}
              name="dataDaOperacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da operação</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full flex justify-start text-left font-normal",
                            !field.value && "text-muted-foreground col-span-2"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <MoneyInput
              form={form}
              name="valorLiberado"
              label="Valor liberado"
            />

            <NumberInput
              form={form}
              name="comissao"
              label="Comissao %"
              decimals={2}
              maxLength={6}
              maxValue={100}
            />
          </div>
          <DialogFooter className="mt-8 col-span-2">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setSearchParams({ operationModal: "false" });
              }}
            >
              Cancelar
            </Button>

            <DialogClose asChild></DialogClose>
            <Button type="submit">Cadastrar</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
