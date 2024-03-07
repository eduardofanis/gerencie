import {
  Users,
  BarChart4,
  HandCoins,
  Phone,
  HeartHandshake,
  Bot,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { SubscriberContext } from "@/contexts/SubscriberContext";
import { CollaboratorContext } from "@/contexts/CollaboratorContext";

export default function Sidebar() {
  const { user } = React.useContext(AuthContext);
  const { subscriber } = React.useContext(SubscriberContext);
  const { collaborator } = React.useContext(CollaboratorContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = React.useState(false);
  const [showSidebar, setShowSidebar] = React.useState(false);

  React.useEffect(() => {
    if (
      pathname == "/" ||
      pathname == "/operacoes" ||
      pathname == "/clientes" ||
      pathname == "/colaboradores" ||
      pathname == "/automacoes" ||
      pathname == "/conta"
    )
      setShowSidebar(true);
    else setShowSidebar(false);
  }, [pathname]);

  const checkGerenciarColaboradoresPermission =
    collaborator?.permissions.gerenciarColaboradores === false
      ? false
      : subscriber?.plano === "Individual"
      ? false
      : true;

  const checkGerenciarAutomacoesPermission =
    subscriber?.plano !== "Empresarial"
      ? false
      : collaborator?.permissions.gerenciarAutomacoes === false
      ? false
      : true;

  if (!user) return null;
  if (!showSidebar) return null;
  return (
    <>
      <div className="w-[86px]"></div>
      <div
        className="h-screen border-slate-100 border-r p-4 fixed bg-white z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Button
          variant="ghost"
          className={`flex items-center h-[54px] w-full justify-start font-normal overflow-hidden truncate text-left space-x-2 ${
            pathname == "/conta" && "bg-slate-50"
          } rounded-md p-2 cursor-pointer`}
          onClick={() => navigate("/conta")}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || ""} />
            <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
          </Avatar>

          {isHovered && (
            <div className="truncate">
              <h2 className="font-medium whitespace-nowrap truncate">
                {user.displayName}
              </h2>
              <span className="text-sm text-ellipsis truncate break-words opacity-85">
                {user.email}
              </span>
            </div>
          )}
        </Button>

        <Separator className="my-4" />

        <div className="grid gap-2">
          <Button
            className={`space-x-4 justify-start ${
              pathname == "/" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/")}
          >
            <BarChart4 className="h-5 w-5" />
            {isHovered && <span>Visão geral</span>}
          </Button>
          <Button
            className={`space-x-4 justify-start ${
              pathname == "/operacoes" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/operacoes")}
          >
            <HandCoins className="h-5 w-5" />
            {isHovered && <span>Operações</span>}
          </Button>
          <Button
            className={`space-x-4 justify-start ${
              pathname == "/clientes" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/clientes")}
          >
            <Users className="h-5 w-5" />
            {isHovered && <span>Clientes</span>}
          </Button>
          <Button
            className={`space-x-4 justify-start ${
              pathname == "/colaboradores" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/colaboradores")}
            disabled={!checkGerenciarColaboradoresPermission}
          >
            <HeartHandshake className="h-5 w-5" />
            {isHovered && <span>Colaboradores</span>}
          </Button>
          <Button
            className={`space-x-4 justify-start ${
              pathname == "/automacoes" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/automacoes")}
            disabled={!checkGerenciarAutomacoesPermission}
          >
            <Bot className="h-5 w-5" />
            {isHovered && <span>Automações</span>}
          </Button>
          <Button asChild className="space-x-4 justify-start" variant={"ghost"}>
            <a href="https://wa.me/5541997590249" target="_blank">
              <Phone className="h-5 w-5" />
              {isHovered && <span>Suporte</span>}
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
