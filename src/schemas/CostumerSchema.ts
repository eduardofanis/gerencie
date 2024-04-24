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
  email: z
    .string()
    .refine((value) =>
      value?.length > 0 ? /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value) : true
    )
    .optional(),
  dataDeNascimento: z
    .string()
    .refine((value) =>
      value?.length > 0 ? /^\d{2}\/\d{2}\/\d{4}$/.test(value) : true
    ),
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
    )
    .optional(),
  naturalidade: z.string().optional(),
  telefone: z
    .string()
    .refine((value) =>
      value?.length > 0 ? value.length === 10 || value.length === 11 : true
    )
    .optional(),
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
    })
    .optional(),
  cpf: z.string().min(11).max(11),
  rg: z.string(),
  dataDeEmissao: z
    .string()
    .refine((value) =>
      value?.length > 0 ? /^\d{2}\/\d{2}\/\d{4}$/.test(value) : true
    )
    .optional(),
  localDeEmissao: z.string(),
  banco: z.string(),
  agencia: z.string(),
  numeroDaConta: z.string(),
  digitoDaConta: z.string(),
  chavePix: z
    .string()
    .refine((value) =>
      value?.length > 0
        ? value === "Telefone" ||
          value === "E-mail" ||
          value === "Banco" ||
          value === "CPF"
        : true
    )
    .optional(),
  cep: z.string(),
  rua: z.string(),
  numeroDaRua: z.string(),
  complemento: z.string(),
  estado: z
    .string()
    .refine((value) =>
      value?.length > 0 ? estadosBrasil.includes(value) : true
    )
    .optional(),
  cidade: z.string(),
  bairro: z.string(),
});

export { CostumerSchema };
