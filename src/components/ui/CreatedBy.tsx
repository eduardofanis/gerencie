import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserData } from "@/services/user";
import { UserDataProps } from "@/types/UserDataProps";

import React from "react";

export default function CreatedBy({ id }: { id: string }) {
  const [data, setData] = React.useState<UserDataProps | null>();

  React.useEffect(() => {
    getUserData(id).then((data) => {
      setData(data);
    });
  }, [id]);

  if (!data) return null;
  return (
    <div className="ml-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="size-8">
              <AvatarImage src={data.avatar} />
              <AvatarFallback>{data.nome.charAt(0)}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{data.nome}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
