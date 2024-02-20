import { z } from "zod";

const NewOperationFormSchema = z.object({
  clienteId: z.string().min(1),
  tipoDaOperacao: z.string().min(1),
  statusDaOperacao: z.string().min(1),
  dataDaOperacao: z.date(),
  promotora: z
    .string()
    .min(1)
    .transform((nome) => {
      return nome
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  valorLiberado: z.number().min(1),
  comissao: z.string().min(1),
});

export { NewOperationFormSchema };
