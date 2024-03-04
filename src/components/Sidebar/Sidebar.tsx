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
  const componentRef = React.useRef<HTMLDivElement>(null);

  const [largeScreen, setLargeScreen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [showTitle, setShowTitle] = React.useState(false);
  const [componentSize, setComponentSize] = React.useState(278);

  React.useEffect(() => {
    function handleResize() {
      const screenSize = window.innerWidth;
      if (screenSize >= 1280) {
        setLargeScreen(true);
        if (componentRef.current) {
          const width = componentRef.current.offsetWidth;
          if (!isHovered || !showTitle) setComponentSize(width);
          console.log(width);
        }
      } else {
        setLargeScreen(false);
        if (componentRef.current) {
          const width = componentRef.current.offsetWidth;
          if (!isHovered || !showTitle) setComponentSize(width);
          console.log(width);
        }
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [isHovered, largeScreen, showTitle]);

  React.useEffect(() => {
    if (!largeScreen) {
      if (!largeScreen && isHovered) setShowTitle(true);
      else if (largeScreen && !isHovered) setShowTitle(true);
      else setShowTitle(false);
    } else {
      setShowTitle(true);
    }
  }, [isHovered, largeScreen]);

  if (!user) return null;
  return (
    <>
      <div
        style={{
          width: `${componentSize}px`,
        }}
      ></div>
      <div
        className="h-screen border-slate-100 border-r p-4 fixed bg-white z-50"
        ref={componentRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`flex items-center space-x-2 hover:bg-slate-100 ${
            pathname == "/conta" && "bg-slate-50"
          } rounded-md p-2 cursor-pointer`}
          onClick={() => navigate("/conta")}
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={auth.currentUser?.photoURL || ""} />
            <AvatarFallback>
              {auth.currentUser?.displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {showTitle && (
            <div>
              <h2 className="font-medium whitespace-nowrap">
                {auth.currentUser?.displayName}
              </h2>
              <span className="text-sm text-ellipsis break-words opacity-85">
                {auth.currentUser?.email}
              </span>
            </div>
          )}
        </div>

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
            {showTitle && <span>Dashboard</span>}
          </Button>
          <Button
            className={`space-x-4 justify-start ${
              pathname == "/operacoes" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/operacoes")}
          >
            <HandCoins className="h-5 w-5 " />
            {showTitle && <span>Operações</span>}
          </Button>
          <Button
            className={`space-x-4 justify-start ${
              pathname == "/clientes" && "bg-slate-50"
            }`}
            variant={"ghost"}
            onClick={() => navigate("/clientes")}
          >
            <Users className="h-5 w-5 " />
            {showTitle && <span>Clientes</span>}
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
            {showTitle && <span>Funcionários</span>}
          </Button>
          <Button asChild className="space-x-4 justify-start" variant={"ghost"}>
            <a href="https://wa.me/5541997590249" target="_blank">
              <Phone className="h-5 w-5 " />
              {showTitle && <span>Suporte</span>}
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
