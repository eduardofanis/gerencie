import SignUpForm from "../Forms/SignUpForm";
import { GanttChart, X } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { CreateAccountSchema } from "@/schemas/CreateAccountSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function SignUp() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof CreateAccountSchema>>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      plan: "",
    },
  });

  return (
    <div className="grid grid-cols-2 w-full h-screen">
      <div className="bg-slate-950 p-8 w-full h-full text-slate-50 flex flex-col justify-between">
        <div className="flex gap-4">
          <GanttChart className="w-8 h-8" />

          <h1 className="font-medium text-2xl">gerencie.</h1>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-medium text-lg">
            “Produtividade nunca é um acidente. É sempre o resultado de
            comprometimento com a excelência, planejamento inteligente e esforço
            focado.”
          </p>
          <span>Paul J. Meyer</span>
        </div>
      </div>
      <div className="flex flex-col p-8 place-content-center items-center relative">
        <div className="absolute flex gap-2 top-8 right-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">Planos</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Planos</DialogTitle>
                <DialogDescription>
                  Selecione o plano que mais se enquadra nas suas necessidades.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 h-[360px] gap-4 pt-4">
                <div className="text-center rounded-lg p-4 flex bg-slate-50 flex-col justify-between">
                  <h2>Individual</h2>
                  <span className="text-lg font-medium">R$ 89,90/mês</span>
                  <ul className="space-y-1 list-disc list-inside text-sm mt-4 mb-8 text-slate-600">
                    <li>Clientes ilimitados;</li>
                    <li>Operações ilimitadas;</li>
                    <li>Visão geral de performance;</li>
                    <li>Suporte;</li>
                  </ul>
                  <DialogClose asChild>
                    <Button
                      variant={"outline"}
                      className="w-full mt-auto border-0"
                      onClick={() => form.setValue("plan", "Individual")}
                    >
                      Selecionar plano
                    </Button>
                  </DialogClose>
                </div>
                <div className="text-center rounded-lg p-4 flex bg-slate-950 flex-col justify-between relative">
                  <h2 className="text-white">Empresarial</h2>
                  <span className="text-lg font-medium text-white">
                    R$ 349,90/mês
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-sm mt-4 mb-8 text-slate-300">
                    <li>Clientes ilimitados;</li>
                    <li>Operações ilimitadas;</li>
                    <li>Visão geral de performance;</li>
                    <li>Colaboradores ilimitados;</li>
                    <li>Mensagens automáticas;</li>
                    <li>Suporte pioritário;</li>
                  </ul>
                  <DialogClose asChild>
                    <Button
                      className="w-full mt-auto bg-slate-900"
                      onClick={() => form.setValue("plan", "Empresarial")}
                    >
                      Selecionar plano
                    </Button>
                  </DialogClose>
                  <div className="absolute -top-3 text-yellow-900 right-8 left-8 bg-yellow-500 p-1 text-xs font-medium rounded">
                    Melhor custo X benefício!
                  </div>
                </div>
                <div className="text-center rounded-lg p-4 flex flex-col bg-slate-50 justify-between">
                  <h2>Time</h2>
                  <span className="text-lg font-medium">R$ 149,90/mês</span>
                  <ul className="space-y-1 list-disc list-inside text-sm mt-4 mb-8 text-slate-600">
                    <li>Clientes ilimitados;</li>
                    <li>Operações ilimitadas;</li>
                    <li>Visão geral de performance;</li>
                    <li>Limite de 3 Colaboradores;</li>
                    <li>Suporte pioritário;</li>
                  </ul>
                  <DialogClose asChild>
                    <Button
                      variant={"outline"}
                      className="w-full mt-auto border-0"
                      onClick={() => form.setValue("plan", "Time")}
                    >
                      Selecionar plano
                    </Button>
                  </DialogClose>
                </div>
              </div>
              <DialogClose className="absolute top-4 right-4">
                <X className="h-4 w-4" />
              </DialogClose>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" onClick={() => navigate("/login")}>
            Entrar
          </Button>
        </div>

        <SignUpForm form={form} />
      </div>
    </div>
  );
}
