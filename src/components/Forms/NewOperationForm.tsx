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
import { Input } from "../ui/input";
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
import { GetCostumers, NewOperation } from "@/api";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MoneyInput from "./Input/MoneyInput";
import { NewCostumerFormSchema } from "../../schemas/NewCostumerFormSchema";

import { NewOperationFormSchema } from "@/schemas/NewOperationFormSchema";
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

export default function NewOperationForm() {
  const [data, setData] =
    React.useState<z.infer<typeof NewCostumerFormSchema>[]>();
  const [nomeDoCliente, setNomeDoCliente] = React.useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();
  const [operationTypes, setOperationTypes] =
    React.useState<UserDataProps | null>(null);

  const form = useForm<z.infer<typeof NewOperationFormSchema>>({
    resolver: zodResolver(NewOperationFormSchema),
    defaultValues: {
      clienteId: "",
      tipoDaOperacao: "",
      statusDaOperacao: "",
      valorLiberado: 0,
      comissao: "",
    },
  });
  function onSubmit(values: z.infer<typeof NewOperationFormSchema>) {
    NewOperation(values, nomeDoCliente);
    setSearchParams({ operationModal: "false" });
  }

  React.useEffect(() => {
    async function getConsumers() {
      const costumers = await GetCostumers();
      setData(costumers);
    }
    getConsumers();
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
                                  (
                                    cliente: z.infer<
                                      typeof NewCostumerFormSchema
                                    >
                                  ) => (
                                    <CommandItem
                                      value={cliente.id}
                                      key={cliente.id}
                                      onSelect={() => {
                                        form.setValue(
                                          "clienteId",
                                          cliente.id ? cliente.id : ""
                                        );
                                        console.log(cliente.nome);
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
                            key={tipo.name + tipo.color}
                            value={tipo.name}
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

            <FormField
              control={form.control}
              name="statusDaOperacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status da operação</FormLabel>
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
                      <SelectItem value="1">Sucesso</SelectItem>
                      <SelectItem value="2">Processando</SelectItem>
                      <SelectItem value="3">Pendente</SelectItem>
                      <SelectItem value="4">Falha</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="promotora"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotora</FormLabel>
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
                      <SelectItem value="sucesso">Sucesso</SelectItem>
                      <SelectItem value="processando">Processando</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="falha">Falha</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <MoneyInput
              form={form}
              name="valorLiberado"
              label="Valor liberado"
            />

            <FormField
              control={form.control}
              name="comissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comissão</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
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
