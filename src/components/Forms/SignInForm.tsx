import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { userSignIn } from "@/services/user";

export default function SignInForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  async function handleSignIn() {
    try {
      setLoading(true);
      await userSignIn(email, password);
      navigate("/");
    } catch (e) {
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
    <div className="w-[340px] flex flex-col gap-3">
      <div className="text-center space-y-2 mb-2">
        <h2 className="text-2xl font-bold  ">Entrar</h2>
        <p className="opacity-85 text-sm">
          Preencha os campos para ser redirecionado.
        </p>
      </div>

      <Input
        id="email"
        type="email"
        placeholder="E-mail"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        id="password"
        type="password"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button disabled={loading} onClick={handleSignIn}>
        Entrar
      </Button>
      <div className="text-center text-sm">
        <span className="opacity-85">Esqueceu a senha?</span>
        <Button
          variant="link"
          className="p-1"
          onClick={() => navigate("/password_reset")}
        >
          Clique aqui
        </Button>
      </div>
    </div>
  );
}
