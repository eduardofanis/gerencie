import { NewCostumer } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { CostumerSchema } from "../../schemas/CostumerSchema";
import { Button } from "../ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form } from "../ui/form";
import BirthDateInput from "./Input/BirthDateInput";
import CPFInput from "./Input/CPFInput";
import CepInput from "./Input/CepInput";
import ComboInput from "./Input/ComboInput";
import NumberInput from "./Input/NumberInput";
import PhoneNumberInput from "./Input/PhoneNumberInput";
import RGInput from "./Input/RGInput";
import SelectInput, { SelectItems } from "./Input/SelectInput";
import TextInput from "./Input/TextInput";

export default function NewCostumerForm() {
  const [, setSearchParams] = useSearchParams();
  const [stepOne, setStepOne] = React.useState(true);
  const [stepTwo, setStepTwo] = React.useState(false);
  const [stepThree, setStepThree] = React.useState(false);
  const [stepFour, setStepFour] = React.useState(false);

  const form = useForm<z.infer<typeof CostumerSchema>>({
    resolver: zodResolver(CostumerSchema),
    defaultValues: {
      nome: "",
      nomeDaMae: "",
      cpf: "",
      rg: "",
      email: "",
      agencia: 0,
      numeroDaConta: 0,
      digitoDaConta: 0,
      chavePix: "",
      banco: "",
      dataDeEmissao: "",
      localDeEmissao: "",
      dataDeNascimento: "",
      sexo: "",
      estadoCivil: "",
      naturalidade: "",
      telefone: "",
      cep: "",
      rua: "",
      numeroDaRua: 0,
      complemento: "",
      estado: "",
      cidade: "",
      bairro: "",
    },
  });

  function onSubmit(values: z.infer<typeof CostumerSchema>) {
    NewCostumer(values);
    setSearchParams({});
  }

  const SexoItems: SelectItems[] = [
    {
      value: "Masculino",
      label: "Masculino",
    },
    {
      value: "Feminino",
      label: "Feminino",
    },
    {
      value: "Outro",
      label: "Outro",
    },
  ];

  const EstadoCivilItems: SelectItems[] = [
    {
      value: "Solteiro",
      label: "Solteiro",
    },
    {
      value: "Casado",
      label: "Casado",
    },
    {
      value: "Separado",
      label: "Separado",
    },
    {
      value: "Divorciado",
      label: "Divorciado",
    },
    {
      value: "Viúvo",
      label: "Viúvo",
    },
  ];

  const ChavePixItems: SelectItems[] = [
    {
      value: "Telefone",
      label: "Telefone",
    },
    {
      value: "E-mail",
      label: "E-mail",
    },
    {
      value: "Banco",
      label: "Dados bancários",
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
          Preencha os campos obrigatórios (*) e clique em próximo.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={stepOne ? "" : "hidden"}>
            <div className="mt-4">
              <h2 className="mb-2 font-medium">Dados pessoais</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1 col-span-2">
                  <TextInput form={form} label="Nome completo *" name="nome" />
                </div>

                <div className="space-y-1 col-span-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1 col-span-2">
                      <TextInput form={form} label="E-mail *" name="email" />
                    </div>

                    <PhoneNumberInput
                      form={form}
                      name="telefone"
                      label="Telefone *"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

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

                <TextInput
                  form={form}
                  label="Naturalidade"
                  name="naturalidade"
                />
              </div>
            </div>
            <DialogFooter className="mt-8 col-span-2">
              <Button
                type="button"
                variant={"outline"}
                className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={() => {
                  setSearchParams({});
                }}
              >
                Cancelar
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setStepOne(false);
                  setStepTwo(true);
                  setStepThree(false);
                  setStepFour(false);
                }}
              >
                Próximo
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </DialogFooter>
          </div>

          <div className={stepTwo ? "" : "hidden"}>
            <div className="mt-4">
              <h2 className="mb-2 font-medium">Documentação</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1 col-span-2">
                  <TextInput
                    form={form}
                    label="Nome da Mãe *"
                    name="nomeDaMae"
                  />
                </div>
                <CPFInput
                  form={form}
                  name="cpf"
                  label="CPF *"
                  placeholder="000.000.000-00"
                />
                <RGInput
                  form={form}
                  name="rg"
                  label="RG *"
                  placeholder="00.000.000-0"
                />
                <BirthDateInput
                  form={form}
                  label="Data de emissão *"
                  name="dataDeEmissao"
                />
                <TextInput
                  form={form}
                  label="Local de emissão *"
                  name="localDeEmissao"
                />
              </div>
            </div>
            <DialogFooter className="mt-8 col-span-2">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  setStepOne(true);
                  setStepTwo(false);
                  setStepThree(false);
                  setStepFour(false);
                }}
              >
                <ArrowLeft className="mr-2 size-4" />
                Voltar
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setStepOne(false);
                  setStepTwo(false);
                  setStepThree(true);
                  setStepFour(false);
                }}
              >
                Próximo
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </DialogFooter>
          </div>

          <div className={stepThree ? "" : "hidden"}>
            <div className="mt-4">
              <h2 className="mb-2 font-medium">Dados bancários</h2>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <TextInput form={form} label="Banco *" name="banco" />
                <SelectInput
                  form={form}
                  name="chavePix"
                  label="Chave PIX"
                  placeholder="Selecione"
                  selectItems={ChavePixItems}
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-2">
                  <NumberInput form={form} label="Agência *" name="agencia" />
                </div>

                <div className="col-span-2">
                  <NumberInput
                    form={form}
                    label="Conta *"
                    name="numeroDaConta"
                  />
                </div>

                <NumberInput
                  form={form}
                  label="Dígito *"
                  name="digitoDaConta"
                />
              </div>
            </div>
            <DialogFooter className="mt-8 col-span-2">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  setStepOne(false);
                  setStepTwo(true);
                  setStepThree(false);
                  setStepFour(false);
                }}
              >
                <ArrowLeft className="mr-2 size-4" />
                Voltar
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setStepOne(false);
                  setStepTwo(false);
                  setStepThree(false);
                  setStepFour(true);
                }}
              >
                Próximo
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </DialogFooter>
          </div>

          <div className={stepFour ? "" : "hidden"}>
            <div className="mt-4">
              <h2 className="mb-2 font-medium">Endereço</h2>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-4 w-[160px]">
                  <CepInput
                    form={form}
                    name="cep"
                    label="CEP *"
                    placeholder="00000-000"
                  />
                </div>

                <div className="space-y-1 col-span-3">
                  <TextInput form={form} label="Rua *" name="rua" />
                </div>

                <NumberInput form={form} label="Número *" name="numeroDaRua" />

                <TextInput form={form} label="Complemento" name="complemento" />
                <ComboInput
                  form={form}
                  label="Estado"
                  name="estado"
                  placeholder="Estado *"
                  selectItems={estados}
                />
                <TextInput form={form} label="Cidade *" name="cidade" />
                <TextInput form={form} label="Bairro *" name="bairro" />
              </div>
            </div>
            <DialogFooter className="mt-8 col-span-2">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  setStepOne(false);
                  setStepTwo(false);
                  setStepThree(true);
                  setStepFour(false);
                }}
              >
                <ArrowLeft className="mr-2 size-4" />
                Voltar
              </Button>

              <Button type="submit">
                Cadastrar
                <Check className="ml-2 size-4" />
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
      <DialogClose
        className="absolute top-4 right-4"
        onClick={() => setSearchParams({})}
      >
        <X className="h-4 w-4" />
      </DialogClose>
    </>
  );
}
