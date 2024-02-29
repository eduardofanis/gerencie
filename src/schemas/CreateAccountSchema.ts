import { z } from "zod";

const CreateAccountSchema = z.object({
  name: z
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
  password: z.string().min(6, "Sua senha precisa ter no mínimo 6 digitos."),
  confirmPassword: z
    .string()
    .min(6, "Sua senha precisa ter no mínimo 6 digitos."),
  plan: z.string().min(1),
});

export { CreateAccountSchema };
