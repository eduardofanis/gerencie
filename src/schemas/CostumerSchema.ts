import { z } from "zod";

const CostumerSchema = z.object({
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
  cpf: z.string(),
  dataDeNascimento: z.string().min(1),
  sexo: z.string(),
  estadoCivil: z.string(),
  naturalidade: z.string(),
  telefone: z.string().min(1),
  cep: z.string().min(8),
  rua: z.string().min(1),
  numeroDaRua: z.string().min(1),
  complemento: z.string(),
  estado: z.string().min(1),
  cidade: z.string().min(1),
  bairro: z.string().min(1),
  tipoDoDocumento: z.string(),
  frenteDoDocumento: z
    .instanceof(FileList)
    .transform((file) => file.length > 0 && file.item(0))
    .refine((file) => !file || (!!file && file.type?.startsWith("image")), {
      message: "Only images are allowed to be sent.",
    })
    .optional(),
  versoDoDocumento: z
    .instanceof(FileList)
    .transform((file) => file.length > 0 && file.item(0))
    .refine((file) => !file || (!!file && file.type?.startsWith("image")), {
      message: "Only images are allowed to be sent.",
    })
    .optional(),
});

export { CostumerSchema };
