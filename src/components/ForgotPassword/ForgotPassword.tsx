import { GanttChart } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "../Forms/FogortPasswordForm";

export default function ForgotPassword() {
  const navigate = useNavigate();

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
        <Button
          className="absolute top-8 right-8"
          variant="ghost"
          onClick={() => navigate("/signup")}
        >
          Criar conta
        </Button>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
