import { CollaboratorContext } from "@/contexts/CollaboratorContext";
import { SubscriberContext } from "@/contexts/SubscriberContext";
import { GetCollaborators } from "@/services/api";
import { getUserData } from "@/services/user";
import { UserDataProps } from "@/types/UserDataProps";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CostumersCard from "./Cards/CostumersCard";
import IncomeByPeriodCard from "./Cards/IncomeByPeriodCard";
import IncomeMonthCard from "./Cards/IncomeMonthCard";
import OperationsDayCard from "./Cards/OperationsDayCard";
import OperationsMonthCard from "./Cards/OperationsMonthCard";

export default function Home() {
  const { collaborator } = React.useContext(CollaboratorContext);
  const { subscriber } = React.useContext(SubscriberContext);
  const [collaboratorsData, setCollaboratorsData] = React.useState<
    UserDataProps[]
  >([]);
  const [value, setValue] = React.useState("");

  const permission =
    !collaborator && subscriber?.plano !== "Individual"
      ? true
      : collaborator &&
        collaborator.permissions.visaoEstatisticasDeTodos === true
      ? true
      : false;

  React.useEffect(() => {
    async function getCollaborators() {
      const collaborators = await GetCollaborators();
      const subscriberUserData = await getUserData(subscriber!.id);
      const newCollaboratorsData = [
        ...(collaborators || []),
        subscriberUserData!,
      ];
      setCollaboratorsData(newCollaboratorsData);
    }
    getCollaborators();
  }, [subscriber]);

  React.useEffect(() => {
    if (collaborator) setValue(collaborator.id);
  }, [collaborator]);

  return (
    <div className="p-8 w-full h-screen flex flex-col">
      <div className="flex items-center  gap-4 mb-8">
        <h1 className="text-3xl font-bold">Visão geral</h1>
        <Select
          value={value}
          disabled={!permission}
          onValueChange={(event) => {
            if (event === "Todos") setValue("");
            else setValue(event);
          }}
        >
          <SelectTrigger
            className={` ${
              !value && "text-slate-500"
            } font-normal gap-2 text-sm w-auto`}
          >
            <SelectValue placeholder="Todos"></SelectValue>
          </SelectTrigger>
          <SelectContent className="w-[300px]">
            <SelectGroup>
              <SelectItem value="Todos" onSelect={() => setValue("")}>
                <span>Todos</span>
              </SelectItem>
              {collaboratorsData && collaboratorsData.length > 0 ? (
                collaboratorsData.map((collaborator) => (
                  <SelectItem value={collaborator.id} key={collaborator.id}>
                    <div className="flex gap-3 items-center">
                      {collaborator.nome}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="text-sm text-center my-2">
                  Nenhum colaborador encontrado
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <IncomeMonthCard collaboratorUid={value} />
        <OperationsMonthCard collaboratorUid={value} />
        <OperationsDayCard collaboratorUid={value} />
        <CostumersCard collaboratorUid={value} />
      </div>
      <div className="mt-4 flex flex-col min-h-[340px] flex-grow">
        <IncomeByPeriodCard collaboratorUid={value} />
      </div>
      {/* <LastOperationsCard collaboratorUid={value} /> */}
    </div>
  );
}
