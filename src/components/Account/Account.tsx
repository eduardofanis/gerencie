import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import { firebaseApp } from "@/main";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Camera, LogOut, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import React from "react";
import { toast } from "../ui/use-toast";
import { updateProfilePicture, userSignIn, userSignOut } from "@/services/user";
import { Separator } from "../ui/separator";
import { Timestamp, doc, getFirestore, updateDoc } from "firebase/firestore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CollaboratorContext } from "@/contexts/CollaboratorContext";
import { SubscriberContext } from "@/contexts/SubscriberContext";

export default function Account() {
  const [password, setPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password2, setPassword2] = React.useState("");

  const auth = getAuth(firebaseApp);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { collaborator } = React.useContext(CollaboratorContext);
  const { subscriber } = React.useContext(SubscriberContext);

  async function handleNewPassword() {
    try {
      if (newPassword && password) {
        if (newPassword.length < 6 || password.length < 6) {
          toast({
            title: "A senha precisa ter mais que 6 dígitos.",
            duration: 5000,
            variant: "destructive",
          });
        } else {
          await userSignIn(auth.currentUser!.email!, password);
          await updatePassword(auth!.currentUser!, newPassword);
          toast({
            title: "Senha alterada com sucesso.",
            duration: 5000,
            variant: "success",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Algo deu errado, tente novamente.",
        duration: 5000,
        variant: "destructive",
      });
    }
  }

  async function handleNewEmail() {
    const db = getFirestore(firebaseApp);
    try {
      if (email && password2) {
        await userSignIn(auth.currentUser!.email!, password2);
        await updateEmail(auth.currentUser!, email);
        await updateDoc(doc(db, auth.currentUser!.uid, "data"), {
          email: email,
        });
        toast({
          title: "E-mail alterado com sucesso.",
          duration: 5000,
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Algo deu errado, tente novamente.",
        duration: 5000,
        variant: "destructive",
      });
    }
  }

  function differenceInDays(date1: Date, date2: Date) {
    const diffInMilliseconds = Math.abs(
      Timestamp.fromDate(date2).seconds * 1000 -
        Timestamp.fromDate(date1).seconds * 1000
    );
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.floor(diffInMilliseconds / millisecondsPerDay);
  }

  // Função para formatar a mensagem de validade em relação à data atual
  function formatValidityMessage(date: Date) {
    const expirationDate = date;
    const currentDate = new Date();

    const daysDifference = differenceInDays(currentDate, expirationDate);

    return daysDifference;
  }

  function handleProfilePhotoClick() {
    fileInputRef!.current!.click();
  }

  function handleProfilePhotoSelect(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files![0];
    updateProfilePicture(file);
  }

  if (!subscriber) return null;
  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-bold mb-8">Minha conta</h1>
      <div className="grid w-full gap-12">
        <div className="flex items-center space-x-4">
          <Avatar
            className="h-20 w-20 relative cursor-pointer"
            onClick={handleProfilePhotoClick}
          >
            <AvatarImage src={auth.currentUser?.photoURL || ""} />
            <AvatarFallback className="text-xl">
              <Camera className="h-6 w-6 text-black" />
            </AvatarFallback>
            <Input
              ref={fileInputRef}
              className="hidden"
              type="file"
              onChange={(e) => handleProfilePhotoSelect(e)}
            />
          </Avatar>
          <div>
            <h2 className="font-medium text-lg">
              {auth.currentUser?.displayName}
            </h2>
            <span className="text-base text-ellipsis break-words opacity-85">
              {auth.currentUser?.email}
            </span>
            <Button
              variant={"link"}
              className="text-sm flex gap-2 p-0 h-6 text-red-500"
              onClick={userSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sair da conta
            </Button>
          </div>
        </div>

        {!collaborator ? (
          <div className="grid">
            <h2 className="font-medium text-xl mb-2">Assinatura</h2>
            <div className="space-y-1">
              <p>
                Plano:{" "}
                <span
                  className={`font-medium ${
                    subscriber?.plano == "Individual"
                      ? "text-green-800"
                      : subscriber?.plano == "Time"
                      ? "text-yellow-700"
                      : "text-blue-700"
                  }`}
                >
                  {subscriber?.plano}
                </span>
              </p>
              <p>
                Data de Vencimento:{" "}
                <span className="font-medium">
                  {subscriber!.dataDeVencimento.toLocaleDateString("pt-BR")}
                </span>
              </p>
              <p
                className={`pb-1 ${
                  formatValidityMessage(subscriber!.dataDeVencimento) < 7 &&
                  "text-red-600"
                }`}
              >
                {formatValidityMessage(subscriber!.dataDeVencimento) <= 0
                  ? "Sua assinatura venceu, renove para continuar utilizando nosso sistema."
                  : `Sua assinatura vence em ${
                      formatValidityMessage(subscriber!.dataDeVencimento) <= 1
                        ? formatValidityMessage(subscriber!.dataDeVencimento) +
                          " dia."
                        : formatValidityMessage(subscriber!.dataDeVencimento) +
                          " dias."
                    }`}
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>Alterar Plano</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Planos</DialogTitle>
                    <DialogDescription>
                      Selecione o plano que mais se enquadra nas suas
                      necessidades.
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
                      <Button
                        variant={"outline"}
                        className="w-full mt-auto border-0"
                      >
                        Selecionar plano
                      </Button>
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
                      <Button className="w-full mt-auto bg-slate-900">
                        Selecionar plano
                      </Button>
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
                      <Button
                        variant={"outline"}
                        className="w-full mt-auto border-0"
                      >
                        Selecionar plano
                      </Button>
                    </div>
                  </div>
                  <DialogClose className="absolute top-4 right-4">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : (
          <div>
            <p>
              Você está usando uma conta de{" "}
              <span className="font-semibold">Colaborador</span>.
            </p>
            <p>
              Gerenciada por:{" "}
              <span className="font-semibold">{subscriber?.nome}</span>
            </p>
          </div>
        )}

        <div className="flex gap-12">
          <div className="grid">
            <h2 className="font-medium text-xl mb-2">Alterar Senha</h2>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label>Senha atual</Label>
                <Input
                  className="w-[300px]"
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Nova senha</Label>
                <Input
                  className="w-[300px]"
                  value={newPassword}
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <Button onClick={handleNewPassword}>Alterar Senha</Button>
            </div>
          </div>
          <Separator orientation="vertical" />
          <div className="grid">
            <h2 className="font-medium text-xl mb-2">Alterar E-mail</h2>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label>Senha atual</Label>
                <Input
                  className="w-[300px]"
                  value={password2}
                  type="password"
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Novo e-mail</Label>
                <Input
                  className="w-[300px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button onClick={handleNewEmail}>Alterar E-mail</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
