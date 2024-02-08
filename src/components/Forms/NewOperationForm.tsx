import { Button } from "../ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Calendar as CalendarIcon } from "lucide-react";
import { GetConsumers } from "@/api";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MoneyInput from "./Input/MoneyInput";
import { NewCostumerFormSchema } from "../../schemas/NewCostumerFormSchema";
import SelectInput, { SelectItems } from "./Input/SelectInput";
import TextInput from "./Input/TextInput";
import NumberInput from "./Input/NumberInput";
import FileInput from "./Input/FileInput";
import { NewOperationFormSchema } from "@/schemas/NewOperationFormSchema";

export default function NewOperationForm() {
  const form = useForm<z.infer<typeof NewOperationFormSchema>>({
    resolver: zodResolver(NewOperationFormSchema),
    defaultValues: {
      cliente: "",
      tipoDaOperacao: "",
      statusDaOperacao: "",
      valorLiberado: 0,
      comissao: "",
    },
  });
  function onSubmit(values: z.infer<typeof NewOperationFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const SexoItems: SelectItems[] = [
    {
      value: "masculino",
      label: "Masculino",
    },
    {
      value: "feminino",
      label: "Feminino",
    },
    {
      value: "outro",
      label: "Outro",
    },
  ];

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
          <div>
            <h2 className="mb-2 font-medium">Operação</h2>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
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
                        <SelectItem value="fgts">FGTS</SelectItem>
                        <SelectItem value="gov">GOV</SelectItem>
                        <SelectItem value="inss">INSS</SelectItem>
                        <SelectItem value="prefeitura">Prefeitura</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className="space-y-1">
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
                          <SelectItem value="fgts">FGTS</SelectItem>
                          <SelectItem value="gov">GOV</SelectItem>
                          <SelectItem value="inss">INSS</SelectItem>
                          <SelectItem value="prefeitura">Prefeitura</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
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
                          <SelectItem value="sucesso">Sucesso</SelectItem>
                          <SelectItem value="processando">
                            Processando
                          </SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="falha">Falha</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
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
                                !field.value &&
                                  "text-muted-foreground col-span-2"
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
              </div>
              <div className="space-y-1">
                <MoneyInput
                  form={form}
                  name="valorLiberado"
                  label="Valor liberado"
                  placeholder=""
                />
              </div>
              <div className="space-y-1">
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
            </div>
          </div>
          <DialogFooter className="mt-8 col-span-2">
            <DialogClose asChild>
              <Button variant={"outline"} onClick={GetConsumers}>
                Cancelar
              </Button>
            </DialogClose>

            <DialogClose asChild></DialogClose>
            <Button type="submit">Cadastrar</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
