import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { firebaseApp } from "@/main";
import { useNavigate } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { FirebaseError } from "firebase/app";

export default function SignUpForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  async function handleSignUp() {
    const auth = getAuth(firebaseApp);

    try {
      if (password == confirmPassword) {
        setLoading(true);
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(user, {
          displayName: name,
        });
        toast({
          title: "Conta criada com sucesso.",
          variant: "success",
          duration: 5000,
        });
        navigate("/");
      } else {
        toast({ title: "Teste" });
      }
    } catch (e) {
      if (e instanceof FirebaseError && e.code == "auth/email-already-in-use") {
        toast({
          title: "Este e-mail já está em uso.",
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
        <h2 className="text-2xl font-bold  ">Criar conta</h2>
        <p className="opacity-85 text-sm">
          Preencha todos os campos para criar sua conta.
        </p>
      </div>
      <Input
        id="name"
        type="text"
        placeholder="Nome completo"
        onChange={(e) => setName(e.target.value)}
      />
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
      <Input
        id="confirm-password"
        type="password"
        placeholder="Confirmar senha"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button disabled={loading} onClick={handleSignUp}>
        Criar conta
      </Button>
    </div>
  );
}
