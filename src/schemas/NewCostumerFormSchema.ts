import { z } from "zod";

const NewCostumerFormSchema = z.object({
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
  cpf: z.string(),
  dataDeNascimento: z.string().min(1),
  sexo: z.string(),
  estadoCivil: z.string(),
  naturalidade: z.string(),
  telefone: z.string().min(1),
  cep: z.string(),
  rua: z.string(),
  numeroDaRua: z.string(),
  complemento: z.string(),
  estado: z.string(),
  cidade: z.string(),
  bairro: z.string(),
  tipoDoDocumento: z.string(),
  frenteDoDocumento: z
    .instanceof(FileList)
    .transform((file) => file.length > 0 && file.item(0))
    .refine((file) => !file || (!!file && file.type?.startsWith("image")), {
      message: "Only images are allowed to be sent.",
    }),
  versoDoDocumento: z
    .instanceof(FileList)
    .transform((file) => file.length > 0 && file.item(0))
    .refine((file) => !file || (!!file && file.type?.startsWith("image")), {
      message: "Only images are allowed to be sent.",
    }),
});

export { NewCostumerFormSchema };
