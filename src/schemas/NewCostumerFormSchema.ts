import { z } from "zod";

const MAX_IMAGE_SIZE = 5242880; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

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
    .min(11)
    .max(11)
    .regex(new RegExp(/[0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2}/), "teste"),
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

    .optional(),
  versoDoDocumento: z
    .instanceof(FileList)

    .optional(),
  tipoDaOperacao: z.string().min(1),
  statusDaOperacao: z.string().min(1),
  dataDaOperacao: z.date(),
  valorLiberado: z.number().min(1),
  comissao: z.string().min(1),
  images: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 5, `Maximum of 5 images are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ALLOWED_IMAGE_TYPES.includes(file.type)
        ),
      "Only these types are allowed .jpg, .jpeg, .png and .webp"
    ),
});

const ImageNewCostumerFormSchema = NewCostumerFormSchema.extend({
  frenteDoDocumento: NewCostumerFormSchema.shape.frenteDoDocumento.optional(),
  versoDoDocumento: NewCostumerFormSchema.shape.versoDoDocumento.optional(),
});

export { NewCostumerFormSchema, ImageNewCostumerFormSchema };
