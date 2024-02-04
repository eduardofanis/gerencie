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

export default function NewCostumerForm() {
  const form = useForm<z.infer<typeof NewCostumerFormSchema>>({
    resolver: zodResolver(NewCostumerFormSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      dataDeNascimento: "",
      sexo: "",
      estadoCivil: "",
      naturalidade: "",
      telefone: "",
      rua: "",
      numeroDaRua: "",
      complemento: "",
      estado: "",
      cidade: "",
      bairro: "",
      tipoDoDocumento: "",
      tipoDaOperacao: "",
      statusDaOperacao: "",
      valorLiberado: 0,
      comissao: "",
    },
  });
  function onSubmit(values: z.infer<typeof NewCostumerFormSchema>) {
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
        <DialogTitle>Cadastrar novo cliente</DialogTitle>
        <DialogDescription>
          Preencha todos os campos e clique em cadastrar em seguida.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-8"
        >
          <div>
            <h2 className="mb-2 font-medium">Dados pessoais</h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 col-span-3">
                <TextInput form={form} label="Nome completo" name="nome" />
              </div>
              <div className="space-y-1">
                <NumberInput form={form} name="cpf" label="CPF" />
              </div>
              <div className="space-y-1"></div>

              <div className="space-y-1">
                <SelectInput
                  form={form}
                  name="sexo"
                  label="Sexo"
                  placeholder="Selecione"
                  selectItems={SexoItems}
                />
              </div>

              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="estadoCivil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado civil</FormLabel>
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
                          <SelectItem value="solteiro">Solteiro</SelectItem>
                          <SelectItem value="casado">Casado</SelectItem>
                          <SelectItem value="separado">Separado</SelectItem>
                          <SelectItem value="divorciado">Divorciado</SelectItem>
                          <SelectItem value="viuvu">Viúvo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="naturalidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naturalidade</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-medium">Endereço</h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 col-span-2">
                <FormField
                  control={form.control}
                  name="rua"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="numeroDaRua"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="complemento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-medium">Documentos</h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="tipoDoDocumento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo do documento</FormLabel>
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
                          <SelectItem value="rg">RG</SelectItem>
                          <SelectItem value="cnh">CNH</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FileInput
                  form={form}
                  label="Frente do documento"
                  name="frenteDoDocumento"
                  className="pt-28 pb-32 cursor-pointer"
                />
              </div>
              <div className="space-y-1"></div>
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-medium">Operação</h2>
            <div className="grid grid-cols-3 gap-2">
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
            <Button variant={"outline"} onClick={GetConsumers}>
              Cancelar
            </Button>
            <DialogClose asChild></DialogClose>

            <DialogClose asChild></DialogClose>
            <Button type="submit">Cadastrar</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
