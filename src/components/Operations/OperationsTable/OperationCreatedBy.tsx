import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserData } from "@/services/user";
import { UserDataProps } from "@/types/UserDataProps";
import React from "react";

export default function OperationCreatedBy({ id }: { id: string }) {
  const [data, setData] = React.useState<UserDataProps | null>();

  React.useEffect(() => {
    getUserData(id).then((data) => {
      setData(data);
    });
  }, [id]);

  if (!data) return null;
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-8">
        <AvatarImage src={data.avatar} />
        <AvatarFallback>{data.nome.charAt(0)}</AvatarFallback>
      </Avatar>

      <span>{data.nome}</span>
    </div>
  );
}
