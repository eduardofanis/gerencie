import { Button } from "../ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { EditCostumer, GetCostumer } from "@/services/api";
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
import { CostumerProps } from "../Customers/CostumersView";
import Loading from "../ui/Loading";
import { Timestamp } from "firebase/firestore";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export default function EditCostumerForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [costumer, setCostumer] = React.useState<CostumerProps>();
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
      tipoDoDocumento: "",
    },
  });

  React.useEffect(() => {
    if (costumer) {
      form.setValue("nome", costumer.nome);
      form.setValue("bairro", costumer.bairro);
      form.setValue("cep", costumer.cep);
      form.setValue("cidade", costumer.cidade);
      form.setValue("complemento", costumer.complemento);
      form.setValue("cpf", costumer.cpf);
      form.setValue(
        "dataDeNascimento",
        transformTimestampToString(costumer.dataDeNascimento)
      );
      form.setValue("estado", costumer.estado);
      form.setValue("estadoCivil", costumer.estadoCivil);
      form.setValue("naturalidade", costumer.naturalidade);
      form.setValue("numeroDaRua", parseFloat(costumer.numeroDaRua));
      form.setValue("rua", costumer.rua);
      form.setValue("sexo", costumer.sexo);
      form.setValue("telefone", costumer.telefone);
      form.setValue("tipoDoDocumento", costumer.tipoDoDocumento);
    }
  }, [costumer, form]);

  React.useEffect(() => {
    async function getCostumer() {
      const id: string = searchParams.get("editarCliente")!;
      if (searchParams.get("editarCliente")) {
        const costumerData = await GetCostumer(id);
        setCostumer(costumerData);
      }
    }
    getCostumer();
  }, [searchParams]);

  function onSubmit(values: z.infer<typeof CostumerSchema>) {
    const id: string = searchParams.get("editarCliente")!;
    EditCostumer(values, id);
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

  const DocumentoItems: SelectItems[] = [
    {
      value: "RG",
      label: "RG",
    },
    {
      value: "CNH",
      label: "CNH",
    },
    {
      value: "Outro",
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

  function transformTimestampToString(timestamp: Timestamp) {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return `${day}${month}${year}`;
  }

  if (!costumer) return <Loading />;
  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar cliente</DialogTitle>
        <DialogDescription>
          Mude os campos que deseja e em seguida clique em salvar.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={stepOne ? "" : "hidden"}>
            <div className="mt-4">
              <h2 className="mb-2 font-medium">Dados pessoais</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1 col-span-2">
                  <TextInput
                    form={form}
                    label="Nome completo *"
                    name="nome"
                    defaultValue={costumer.nome}
                  />
                </div>
                <CPFInput
                  form={form}
                  name="cpf"
                  label="CPF/RG *"
                  placeholder="000.000.000-00/00.000.000-0"
                  defaultValue={costumer.cpf}
                />
                <PhoneNumberInput
                  form={form}
                  name="telefone"
                  label="Telefone *"
                  placeholder="(00) 00000-0000"
                  defaultValue={costumer.telefone}
                />

                <BirthDateInput
                  form={form}
                  name="dataDeNascimento"
                  label="Data de nascimento *"
                  defaultValue={transformTimestampToString(
                    costumer.dataDeNascimento
                  )}
                />

                <SelectInput
                  form={form}
                  name="sexo"
                  label="Sexo"
                  defaultValue={costumer.sexo}
                  placeholder="Selecione"
                  selectItems={SexoItems}
                />

                <SelectInput
                  form={form}
                  name="estadoCivil"
                  label="Estado civil"
                  placeholder="Selecione"
                  defaultValue={costumer.estadoCivil}
                  selectItems={EstadoCivilItems}
                />

                <TextInput
                  form={form}
                  label="Naturalidade"
                  name="naturalidade"
                  defaultValue={costumer.naturalidade}
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
                    defaultValue={costumer.cep}
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <TextInput
                    form={form}
                    label="Rua *"
                    name="rua"
                    defaultValue={costumer.rua}
                  />
                </div>
                <NumberInput
                  form={form}
                  label="Número *"
                  name="numeroDaRua"
                  defaultValue={costumer.numeroDaRua}
                />
                <TextInput
                  form={form}
                  label="Complemento"
                  name="complemento"
                  defaultValue={costumer.complemento}
                />
                <ComboInput
                  form={form}
                  label="Estado *"
                  name="estado"
                  placeholder="Estado"
                  selectItems={estados}
                  defaultValue={costumer.estado}
                />
                <TextInput
                  form={form}
                  label="Cidade *"
                  name="cidade"
                  defaultValue={costumer.cidade}
                />
                <TextInput
                  form={form}
                  label="Bairro *"
                  name="bairro"
                  defaultValue={costumer.bairro}
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
              <h2 className="mb-2 font-medium">Documentos</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <SelectInput
                    form={form}
                    name="tipoDoDocumento"
                    label="Tipo do documento"
                    placeholder="Selecione"
                    defaultValue={costumer.tipoDoDocumento}
                    selectItems={DocumentoItems}
                  />
                </div>
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
                  setStepOne(false);
                  setStepTwo(true);
                  setStepThree(false);
                }}
              >
                <ArrowLeft className="mr-2 size-4" />
                Voltar
              </Button>

              <Button type="submit">
                Salvar
                <Check className="ml-2 size-4" />
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </>
  );
}
