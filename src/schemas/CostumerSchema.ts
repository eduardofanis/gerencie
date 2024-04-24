import { z } from "zod";

const estadosBrasil = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

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
  email: z.string().email(),
  dataDeNascimento: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  sexo: z
    .string()
    .refine((value) =>
      value?.length > 0
        ? value === "Masculino" || value === "Feminino" || value === "Outro"
        : true
    )
    .optional(),
  estadoCivil: z
    .string()
    .refine((value) =>
      value?.length > 0
        ? value === "Solteiro" ||
          value === "Casado" ||
          value === "Separado" ||
          value === "Divorciado" ||
          value === "Viúvo"
        : true
    ),
  naturalidade: z.string().optional(),
  telefone: z
    .string()
    .refine((value) => value.length === 10 || value.length === 11),
  nomeDaMae: z
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
  cpf: z.string().min(11).max(11),
  rg: z.string().min(9).max(9),
  dataDeEmissao: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  localDeEmissao: z.string().min(1),
  banco: z.string().min(1),
  agencia: z.string().min(1),
  numeroDaConta: z.string().min(1),
  digitoDaConta: z.string().min(1),
  chavePix: z
    .string()
    .refine((value) =>
      value?.length > 0
        ? value === "Telefone" ||
          value === "E-mail" ||
          value === "Banco" ||
          value === "CPF"
        : true
    ),
  cep: z.string().min(8).max(8),
  rua: z.string().min(1),
  numeroDaRua: z.string().min(1),
  complemento: z.string().optional(),
  estado: z
    .string()
    .min(1)
    .refine((value) => estadosBrasil.includes(value)),
  cidade: z.string().min(1),
  bairro: z.string().min(1),
});

export { CostumerSchema };
