import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { userSignUp } from "@/services/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { UseFormReturn } from "react-hook-form";
import { CreateAccountSchema } from "@/schemas/CreateAccountSchema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import TextInput from "./Input/TextInput";

type Props = {
  form: UseFormReturn<z.infer<typeof CreateAccountSchema>>;
};

export default function SignUpForm({ form }: Props) {
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  async function handleSignUp(data: z.infer<typeof CreateAccountSchema>) {
    try {
      setLoading(true);
      await userSignUp(
        data.email,
        data.password,
        data.confirmPassword,
        data.name,
        data.plan
      );
      navigate("/");
    } catch (e) {
      console.log(e);
      toast({
        title: "Algo deu errado, tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-[340px]">
      <div className="text-center space-y-2 mb-5">
        <h2 className="text-2xl font-bold  ">Criar conta</h2>
        <p className="opacity-85 text-sm">
          Preencha todos os campos para criar sua conta.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignUp)}
          className="flex flex-col gap-3"
        >
          <TextInput form={form} name="name" placeholder="Nome completo" />
          <TextInput form={form} name="email" placeholder="E-mail" />
          <TextInput
            form={form}
            name="password"
            type="password"
            placeholder="Senha"
          />

          <TextInput
            form={form}
            type="password"
            name="confirmPassword"
            placeholder="Confirmar senha"
          />

          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Individual">
                      <span>Individual</span> -{" "}
                      <span className="font-medium">89,90/mês</span>
                    </SelectItem>
                    <SelectItem value="Time">
                      <span>Time</span> -{" "}
                      <span className="font-medium">149,90/mês</span>
                    </SelectItem>
                    <SelectItem value="Empresarial">
                      <span>Empresarial</span> -{" "}
                      <span className="font-medium">349,90/mês</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit">
            Criar conta
          </Button>
        </form>
      </Form>
    </div>
  );
}
