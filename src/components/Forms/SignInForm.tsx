import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "@/main";
import { useNavigate } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { FirebaseError } from "firebase/app";

export default function SignInForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  async function handleSignIn() {
    const auth = getAuth(firebaseApp);
    auth.useDeviceLanguage();

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login efetuado com sucesso.",
        variant: "success",
        duration: 5000,
      });

      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError && e.code == "auth/invalid-credential") {
        toast({
          title: "E-mail ou senha inválidos, tente novamente.",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        toast({
          title: "Algo deu errado, tente novamente.",
          variant: "destructive",
          duration: 5000,
        });
      }
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
