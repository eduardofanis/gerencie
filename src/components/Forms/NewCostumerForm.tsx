import { Button } from "../ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { NewCostumer } from "@/services/api";
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
import React from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NewCostumerForm() {
  const [, setSearchParams] = useSearchParams();
  const [stepOne, setStepOne] = React.useState(true);
  const [stepTwo, setStepTwo] = React.useState(false);
  const [stepThree, setStepThree] = React.useState(false);

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
      value: "Casado(a)",
      label: "Casado(a)",
    },
    {
      value: "Separado(a)",
      label: "Separado(a)",
    },
    {
      value: "Divorciado(a)",
      label: "Divorciado(a)",
    },
    {
      value: "Viúvo(a)",
      label: "Viúvo(a)",
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

  const fileList = form.watch("anexos");

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
                <CPFInput
                  form={form}
                  name="cpf"
                  label="CPF/RG *"
                  placeholder="000.000.000-00/00.000.000-0"
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
                }}
              >
                Próximo
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </DialogFooter>
          </div>

          <div className={stepTwo ? "" : "hidden"}>
            <div className="mt-4">
              <h2 className="mb-2 font-medium">Endereço</h2>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3 w-[160px]">
                  <CepInput
                    form={form}
                    name="cep"
                    label="CEP *"
                    placeholder="00000-000"
                  />
                </div>

                <div className="space-y-1 col-span-2">
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
                  setStepOne(true);
                  setStepTwo(false);
                  setStepThree(false);
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
                }}
              >
                Próximo
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </DialogFooter>
          </div>

          <div className={stepThree ? "" : "hidden"}>
            <div className="mt-4">
              <h2 className="mb-2 font-medium">Anexos</h2>
              <div className="grid gap-4">
                <div className="flex gap-2 w-full">
                  <div className="w-full">
                    <FileInput multiple form={form} name="anexos" />
                  </div>

                  <Button
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 p-3"
                    type="button"
                    onClick={() => {
                      form.setValue("anexos", undefined);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                {!fileList || fileList.length <= 0 ? (
                  <span className="text-sm font-medium">
                    Nenhum arquivo anexado.
                  </span>
                ) : (
                  <ul className="flex list-decimal list-inside text-sm flex-col gap-2">
                    {fileList &&
                      Array.from(fileList).map((file) => (
                        <TooltipProvider key={file.name}>
                          <Tooltip>
                            <TooltipTrigger asChild className="text-left w-fit">
                              <li>{file.name}</li>
                            </TooltipTrigger>
                            <TooltipContent>
                              {file.type.includes("image") ? (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="max-h-[300px] w-auto"
                                />
                              ) : (
                                <p>{file.name}</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                  </ul>
                )}
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
    </>
  );
}
