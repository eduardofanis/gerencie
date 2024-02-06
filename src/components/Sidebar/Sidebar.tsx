import { Users, MoreVertical, LogOut, BarChart4, Factory } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "@/main";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "../ui/use-toast";

export default function Sidebar() {
  const auth = getAuth(firebaseApp);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut(auth);
    toast({
      title: "Logout efetuado com sucesso.",
      variant: "destructive",
      duration: 5000,
    });
  }

  return (
    <div className="w-[280px] h-screen border-slate-100 border-r p-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2 ">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              {auth.currentUser?.displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <h2 className="font-medium">{auth.currentUser?.displayName}</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="p-0 m-0" variant={"ghost"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-700 hover:text-red-700 font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2 " />
              Sair da conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator className="my-4" />

      <div className="grid content-between ">
        <div className="space-y-2">
          <Button
            className={`w-full space-x-4 justify-start ${
              pathname == "/" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/")}
          >
            <BarChart4 className="h-5 w-5" />
            <span>Dashboard</span>
          </Button>
          <Button
            className={`w-full space-x-4 justify-start ${
              pathname == "/operacoes" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/operacoes")}
          >
            <Factory className="h-5 w-5 " />
            <span>Operações</span>
          </Button>
          <Button
            className={`w-full space-x-4 justify-start ${
              pathname == "/clientes" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/clientes")}
          >
            <Users className="h-5 w-5 " />
            <span>Clientes</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
