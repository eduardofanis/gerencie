import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebaseApp } from "@/main";
import { useNavigate } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  async function handleForgotPassword() {
    const auth = getAuth(firebaseApp);

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "E-mail enviado com sucesso.",
        description: "Verifique sua caixa de entrada/spam",
        variant: "success",
        duration: 5000,
      });
      navigate("/login");
    } catch (e) {
      toast({
        title: "Algo deu errado, tente novamente!",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-[340px] flex flex-col gap-3">
      <div className="text-center space-y-2 mb-2">
        <h2 className="text-2xl font-bold">Recuperar senha</h2>
        <p className="opacity-85 text-sm">
          Preencha com o e-mail cadastrado na sua conta.
        </p>
      </div>

      <Input
        id="email"
        type="email"
        placeholder="E-mail"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button disabled={loading} onClick={handleForgotPassword}>
        Enviar e-mail
      </Button>
      <Button
        variant="link"
        onClick={() => navigate("/login")}
        className="w-min p-0"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>
    </div>
  );
}
