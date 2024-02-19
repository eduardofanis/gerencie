import { UseFormReturn } from "react-hook-form";

export type CostumerInputProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name:
    | "nome"
    | "cpf"
    | "dataDeNascimento"
    | "sexo"
    | "estadoCivil"
    | "naturalidade"
    | "telefone"
    | "cep"
    | "rua"
    | "numeroDaRua"
    | "complemento"
    | "estado"
    | "cidade"
    | "bairro"
    | "tipoDoDocumento"
    | "frenteDoDocumento"
    | "versoDoDocumento"
    | "cliente"
    | "tipoDaOperacao"
    | "statusDaOperacao"
    | "dataDaOperacao"
    | "valorLiberado"
    | "comissao";
  label: string;
  placeholder?: string;
  className?: string;
};
