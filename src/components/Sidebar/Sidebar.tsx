import {
  Users,
  LogOut,
  BarChart4,
  HandCoins,
  Phone,
  User,
  Contact,
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
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/main";
import { useLocation, useNavigate } from "react-router-dom";
import { userSignOut } from "@/services/user";

export default function Sidebar() {
  const auth = getAuth(firebaseApp);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="h-screen border-slate-100 border-r p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-2 hover:bg-slate-50 rounded-md p-2 cursor-pointer">
            <Avatar>
              <AvatarImage src={auth.currentUser?.photoURL || ""} />
              <AvatarFallback>
                {auth.currentUser?.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium whitespace-nowrap">
                {auth.currentUser?.displayName}
              </h2>
              <span className="text-sm text-ellipsis break-words opacity-85">
                {auth.currentUser?.email}
              </span>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="font-medium cursor-pointer"
            onClick={() => navigate("/conta")}
          >
            <User className="w-4 h-4 mr-2 " />
            Gerenciar conta
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={userSignOut}
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
          <HandCoins className="h-5 w-5 " />
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
            pathname == "/funcionarios" && "bg-slate-50"
          }`}
          variant={"ghost"}
          onClick={() => navigate("/funcionarios")}
          disabled
        >
          <Contact className="h-5 w-5 " />
          <span>Funcionários</span>
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
