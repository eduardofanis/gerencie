import { NewOperationFormSchema } from "@/schemas/NewOperationFormSchema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export type CostumerInputProps = {
  form: UseFormReturn<z.infer<typeof NewOperationFormSchema>>;
  name:
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
