import { Users, BarChart4, HandCoins, Phone, Contact } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/main";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { AuthContext } from "@/AuthContext";

export default function Sidebar() {
  const auth = getAuth(firebaseApp);
  const { user } = React.useContext(AuthContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = React.useState(false);
  const [showSidebar, setShowSidebar] = React.useState(false);

  React.useEffect(() => {
    if (
      pathname == "/" ||
      pathname == "/operacoes" ||
      pathname == "/clientes" ||
      pathname == "/conta"
    )
      setShowSidebar(true);
    else setShowSidebar(false);
  }, [pathname]);

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
            <AvatarImage src={auth.currentUser?.photoURL || ""} />
            <AvatarFallback>
              {auth.currentUser?.displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {isHovered && (
            <div className="truncate">
              <h2 className="font-medium whitespace-nowrap truncate">
                {auth.currentUser?.displayName}
              </h2>
              <span className="text-sm text-ellipsis truncate break-words opacity-85">
                {auth.currentUser?.email}
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
            {isHovered && <span>Dashboard</span>}
          </Button>
          <Button
            className={`space-x-4 justify-start ${
              pathname == "/operacoes" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/operacoes")}
          >
            <HandCoins className="h-5 w-5 " />
            {isHovered && <span>Operações</span>}
          </Button>
          <Button
            className={`space-x-4 justify-start ${
              pathname == "/clientes" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/clientes")}
          >
            <Users className="h-5 w-5 " />
            {isHovered && <span>Clientes</span>}
          </Button>
          <Button
            className={`space-x-4 justify-start ${
              pathname == "/funcionarios" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/funcionarios")}
            disabled
          >
            <Contact className="h-5 w-5 " />
            {isHovered && <span>Funcionários</span>}
          </Button>
          <Button asChild className="space-x-4 justify-start" variant={"ghost"}>
            <a href="https://wa.me/5541997590249" target="_blank">
              <Phone className="h-5 w-5 " />
              {isHovered && <span>Suporte</span>}
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
