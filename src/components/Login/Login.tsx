import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "../Forms/SignInForm";
import SignUpForm from "../Forms/SignUpForm";
import { BarChart, BarChart2, LineChart } from "lucide-react";

export default function Login() {
  return (
    <div className="grid place-items-center w-full h-screen">
      <div className="grid place-items-center absolute top-[10%] z-0">
        <LineChart className="mx-auto w-8 h-8 mb-4" />

        <h1 className="text-center font-bold text-2xl mb-8">
          sua gestão operacional.
        </h1>
      </div>

      <Tabs defaultValue="signin" className="w-[400px] z-10">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Entrar</TabsTrigger>
          <TabsTrigger value="signup">Criar conta</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignInForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
