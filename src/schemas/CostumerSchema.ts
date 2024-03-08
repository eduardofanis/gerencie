import { z } from "zod";

const CostumerSchema = z.object({
  id: z.string().optional(),
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
  cpf: z.string().min(9),
  dataDeNascimento: z.string().min(1),
  sexo: z.string(),
  estadoCivil: z.string(),
  naturalidade: z.string(),
  telefone: z.string().min(1),
  cep: z.string().min(8),
  rua: z.string().min(1),
  numeroDaRua: z.number().min(1),
  complemento: z.string(),
  estado: z.string().min(1),
  cidade: z.string().min(1),
  bairro: z.string().min(1),
  anexos: z.instanceof(FileList).optional(),
});

export { CostumerSchema };
