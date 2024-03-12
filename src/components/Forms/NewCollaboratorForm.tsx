import { Button } from "../ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "./Input/TextInput";
import { useSearchParams } from "react-router-dom";
import PhoneNumberInput from "./Input/PhoneNumberInput";
import { CollaboratorSchema } from "@/schemas/CollaboratorSchema";
import { NewCollaborator } from "@/services/api";
import { X } from "lucide-react";

export default function NewCollaboratorForm() {
  const [, setSearchParams] = useSearchParams();

  const form = useForm<z.infer<typeof CollaboratorSchema>>({
    resolver: zodResolver(CollaboratorSchema),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      confirmPassword: "",
      telefone: "",
    },
  });

  function onSubmit(values: z.infer<typeof CollaboratorSchema>) {
    NewCollaborator(values);
    setSearchParams({});
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">
          Cadastrar novo colaborador
        </DialogTitle>
        <DialogDescription className="text-center">
          Crie uma conta para seu novo colaborador.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3 mt-1">
            <TextInput form={form} placeholder="Nome completo" name="nome" />
            <PhoneNumberInput
              form={form}
              name="telefone"
              placeholder="Telefone"
            />

            <TextInput
              form={form}
              name="email"
              placeholder="E-mail"
              type="email"
            />

            <TextInput
              form={form}
              placeholder="Senha"
              name="password"
              type="password"
            />
            <TextInput
              form={form}
              type="password"
              placeholder="Confirmar senha"
              name="confirmPassword"
            />

            <Button type="submit">Cadastrar</Button>
            <Button
              type="button"
              onClick={() => setSearchParams({})}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
      <DialogClose
        className="absolute top-4 right-4"
        onClick={() => setSearchParams({})}
      >
        <X className="h-4 w-4" />
      </DialogClose>
    </>
  );
}
