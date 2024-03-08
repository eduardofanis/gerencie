import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { firebaseApp } from "@/main";
import { getUserData } from "@/services/user";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

export default function OperationSelectStatus({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  async function handleChange(value: string) {
    const db = getFirestore(firebaseApp);
    const { currentUser } = getAuth(firebaseApp);

    const userData = await getUserData();
    const gerenteUid = userData!.gerenteUid;

    const operationRef = doc(
      db,
      gerenteUid ? gerenteUid : currentUser!.uid,
      "data",
      "operacoes",
      id
    );
    updateDoc(operationRef, { statusDaOperacao: value });
  }

  return (
    <Select value={status ?? ""} onValueChange={handleChange}>
      <SelectTrigger
        className={cn("border-0 ml-1 w-fit justify-normal gap-2 bg-inherit")}
      >
        <div
          className={`w-2 h-2 rounded-full mr-1 ${
            status == "concluido"
              ? "bg-green-500"
              : status == "processando"
              ? "bg-yellow-500"
              : status == "pendente"
              ? "bg-orange-500"
              : status == "falha"
              ? "bg-red-500"
              : "bg-slate-500"
          }`}
        ></div>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="concluido">Concluído</SelectItem>
          <SelectItem value="processando">Processando</SelectItem>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="falha">Falha</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
