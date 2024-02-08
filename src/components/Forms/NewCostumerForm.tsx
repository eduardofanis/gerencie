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
import { Label } from "../ui/label";

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
      cep: "",
      rua: "",
      numeroDaRua: "",
      complemento: "",
      estado: "",
      cidade: "",
      bairro: "",
      tipoDoDocumento: "",
    },
  });
  function onSubmit(values: z.infer<typeof NewCostumerFormSchema>) {
    console.log("aaa");
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mt-4">
            <h2 className="mb-2 font-medium">Dados pessoais</h2>
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1 col-span-2">
                <TextInput form={form} label="Nome completo" name="nome" />
              </div>
              <div className="space-y-1">
                <NumberInput
                  form={form}
                  name="cpf"
                  label="CPF"
                  placeholder="000.000.000-00"
                />
              </div>
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="(00) 00000-0000" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <NumberInput
                form={form}
                name="dataDeNascimento"
                label="Data de nascimento"
              />

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
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-medium">Endereço</h2>
            <div className="grid grid-cols-4 gap-2">
              <NumberInput
                form={form}
                name="cep"
                label="CEP"
                placeholder="00000-000"
              />
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
              <FormField
                control={form.control}
                name="frenteDoDocumento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frente do documento</FormLabel>
                    <FormControl>
                      <Input
                        id="frenteDoDocumento"
                        type="file"
                        {...form.register("frenteDoDocumento")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FileInput
                form={form}
                label="Verso do documento"
                name="versoDoDocumento"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 col-span-2">
            <DialogClose asChild>
              <Button variant={"outline"} onClick={GetConsumers}>
                Cancelar
              </Button>
            </DialogClose>

            <Button type="submit">Cadastrar</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
