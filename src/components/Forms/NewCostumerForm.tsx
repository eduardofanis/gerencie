import { Button } from "../ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { NewCostumer } from "@/api";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CostumerSchema } from "../../schemas/CostumerSchema";
import SelectInput, { SelectItems } from "./Input/SelectInput";
import TextInput from "./Input/TextInput";
import NumberInput from "./Input/NumberInput";
import FileInput from "./Input/FileInput";
import { useSearchParams } from "react-router-dom";
import CepInput from "./Input/CepInput";
import PhoneNumberInput from "./Input/PhoneNumberInput";
import CPFInput from "./Input/CPFInput";
import BirthDateInput from "./Input/BirthDateInput";
import ComboInput from "./Input/ComboInput";

export default function NewCostumerForm() {
  const [_, setSearchParams] = useSearchParams();

  const form = useForm<z.infer<typeof CostumerSchema>>({
    resolver: zodResolver(CostumerSchema),
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
  function onSubmit(values: z.infer<typeof CostumerSchema>) {
    NewCostumer(values);
    _;
    setSearchParams({ modal: "false" });
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

  const EstadoCivilItems: SelectItems[] = [
    {
      value: "casado",
      label: "Casado",
    },
    {
      value: "separado",
      label: "Separado",
    },
    {
      value: "divorciado",
      label: "Divorciado",
    },
    {
      value: "viuvu",
      label: "Viúvo",
    },
  ];

  const DocumentoItems: SelectItems[] = [
    {
      value: "rg",
      label: "RG",
    },
    {
      value: "cnh",
      label: "CNH",
    },
    {
      value: "outro",
      label: "Outro",
    },
  ];

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

  return (
    <>
      <DialogHeader>
        <DialogTitle>Cadastrar novo cliente</DialogTitle>
        <DialogDescription>
          Preencha os campos obrigatórios (*) e clique em cadastrar em seguida.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mt-4">
            <h2 className="mb-2 font-medium">Dados pessoais</h2>
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1 col-span-2">
                <TextInput form={form} label="Nome completo *" name="nome" />
              </div>
              <CPFInput
                form={form}
                name="cpf"
                label="CPF"
                placeholder="000.000.000-00"
              />
              <PhoneNumberInput
                form={form}
                name="telefone"
                label="Telefone *"
                placeholder="(00) 00000-0000"
              />

              <BirthDateInput
                form={form}
                name="dataDeNascimento"
                label="Data de nascimento *"
              />

              <SelectInput
                form={form}
                name="sexo"
                label="Sexo"
                placeholder="Selecione"
                selectItems={SexoItems}
              />

              <SelectInput
                form={form}
                name="estadoCivil"
                label="Estado civil"
                placeholder="Selecione"
                selectItems={EstadoCivilItems}
              />

              <TextInput form={form} label="Naturalidade" name="naturalidade" />
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-medium">Endereço</h2>
            <div className="grid grid-cols-4 gap-2">
              <CepInput
                form={form}
                name="cep"
                label="CEP *"
                placeholder="00000-000"
              />
              <div className="space-y-1 col-span-2">
                <TextInput form={form} label="Rua" name="rua" />
              </div>
              <NumberInput form={form} label="Número" name="numeroDaRua" />
              <TextInput form={form} label="Complemento" name="complemento" />
              <ComboInput
                form={form}
                label="Estado"
                name="estado"
                placeholder="Estado"
                selectItems={estados}
              />
              <TextInput form={form} label="Cidade" name="cidade" />
              <TextInput form={form} label="Bairro" name="bairro" />
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-medium">Documentos</h2>
            <div className="grid grid-cols-3 gap-2">
              <SelectInput
                form={form}
                name="tipoDoDocumento"
                label="Tipo do documento"
                placeholder="Selecione"
                selectItems={DocumentoItems}
              />
              <FileInput
                form={form}
                label="Frente do documento"
                name="frenteDoDocumento"
              />

              <FileInput
                form={form}
                label="Verso do documento"
                name="versoDoDocumento"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 col-span-2">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setSearchParams({ modal: "false" });
              }}
            >
              Cancelar
            </Button>

            <Button type="submit">Cadastrar</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
