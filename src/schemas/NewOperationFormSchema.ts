import { z } from "zod";

const NewOperationFormSchema = z.object({
  cliente: z.string().min(1),
  tipoDaOperacao: z.string().min(1),
  statusDaOperacao: z.string().min(1),
  dataDaOperacao: z.date(),
  promotora: z.string().min(1),
  valorLiberado: z.number().min(1),
  comissao: z.string().min(1),
});

export { NewOperationFormSchema };
