import { z } from "zod";

const NewCostumerFormSchema = z.object({
  nome: z
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
  cpf: z
    .string()
    .refine((cpf) => cpf.length > 0 || cpf.length < 11, "Minimo 8"),
  dataDeNascimento: z.string().min(1),
  sexo: z.string().min(1),
  estadoCivil: z.string().min(1),
  naturalidade: z.string().min(1),
  telefone: z.string().min(1),
  cep: z.string().min(1),
  rua: z.string().min(1),
  numeroDaRua: z.string().min(1),
  complemento: z.string().min(1),
  estado: z.string().min(1),
  cidade: z.string().min(1),
  bairro: z.string().min(1),
  tipoDoDocumento: z.string().min(1),
  frenteDoDocumento: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, `Required`)
    .transform((list) => list.item(0)),
  versoDoDocumento: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, `Required`)
    .transform((list) => list.item(0))
    .optional(),
});

export { NewCostumerFormSchema };
