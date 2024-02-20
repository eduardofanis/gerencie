import {
  Users,
  MoreVertical,
  LogOut,
  BarChart4,
  Factory,
  Settings2,
  Phone,
  User,
} from "lucide-react";
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
    <div className="h-screen border-slate-100 border-r p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-2 hover:bg-slate-50 rounded-md p-2 cursor-pointer">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>
                {auth.currentUser?.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium">{auth.currentUser?.displayName}</h2>
              <span className="text-sm text-ellipsis break-words opacity-85">
                {auth.currentUser?.email}
              </span>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="font-medium cursor-pointer">
            <User className="w-4 h-4 mr-2 " />
            Gerenciar conta
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-red-700 hover:text-red-700 font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2 " />
            Sair da conta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator className="my-4" />

      <div className="grid gap-2">
        <Button
          className={` space-x-4 justify-start ${
            pathname == "/" && "bg-slate-50"
          }`}
          variant={"ghost"}
          onClick={() => navigate("/")}
        >
          <BarChart4 className="h-5 w-5" />
          <span>Dashboard</span>
        </Button>
        <Button
          className={` space-x-4 justify-start ${
            pathname == "/operacoes" && "bg-slate-50"
          }`}
          variant={"ghost"}
          onClick={() => navigate("/operacoes")}
        >
          <Factory className="h-5 w-5 " />
          <span>Operações</span>
        </Button>
        <Button
          className={` space-x-4 justify-start ${
            pathname == "/clientes" && "bg-slate-50"
          }`}
          variant={"ghost"}
          onClick={() => navigate("/clientes")}
        >
          <Users className="h-5 w-5 " />
          <span>Clientes</span>
        </Button>
        <Button
          className={` space-x-4 justify-start ${
            pathname == "/preferencias" && "bg-slate-50"
          }`}
          variant={"ghost"}
          onClick={() => navigate("/preferencias")}
        >
          <Settings2 className="h-5 w-5 " />
          <span>Preferências</span>
        </Button>
        <Button asChild className=" space-x-4 justify-start" variant={"ghost"}>
          <a href="https://wa.me/5541997590249" target="_blank">
            <Phone className="h-5 w-5 " />
            <span>Suporte</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
