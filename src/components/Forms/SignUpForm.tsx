import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { firebaseApp } from "@/main";
import { useNavigate } from "react-router-dom";
import { toast } from "../ui/use-toast";

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
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>
          Ao criar sua conta você será redirecionado a página principal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirm-password">Confirmar senha</Label>
          <Input
            id="confirm-password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={loading} onClick={handleSignUp}>
          Criar conta
        </Button>
      </CardFooter>
    </Card>
  );
}
