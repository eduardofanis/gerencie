import { CostumersDataTable } from "./CustomersTable/CostumersDataTable";
import { CostumersTableColumns } from "./CustomersTable/CostumersTableColumns";
import React from "react";
import { z } from "zod";
import { CostumerSchema } from "@/schemas/CostumerSchema";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/main";
import Loading from "../ui/Loading";
import CostumersView from "./CostumersView";
import { getUserData } from "@/services/user";
import { CollaboratorContext } from "@/contexts/CollaboratorContext";
import { UserDataProps } from "@/types/UserDataProps";
import { GetCollaborators } from "@/services/api";
import { SubscriberContext } from "@/contexts/SubscriberContext";

export type CostumerProps = {
  id: string;
  nome: string;
  cpf: string;
  dataDeNascimento: string;
  sexo: string;
  estadoCivil: string;
  naturalidade: string;
  telefone: string;
  cep: string;
  rua: string;
  numeroDaRua: string;
  complemento: string;
  estado: string;
  cidade: string;
  bairro: string;
  tipoDoDocumento: string;
  frenteDoDocumento: string;
  versoDoDocumento: string;
};

export default function Customers() {
  const [data, setData] = React.useState<z.infer<typeof CostumerSchema>[]>();
  const [collaboratorsData, setCollaboratorsData] = React.useState<
    UserDataProps[]
  >([]);
  const { collaborator } = React.useContext(CollaboratorContext);
  const { subscriber } = React.useContext(SubscriberContext);

  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  React.useEffect(() => {
    getUserData().then((data) => {
      const gerenteUid = data!.gerenteUid;

      const q = !collaborator
        ? query(
            collection(
              db,
              gerenteUid ? gerenteUid : currentUser!.uid,
              "data",
              "clientes"
            )
          )
        : collaborator &&
          collaborator.permissions.gerenciarClientesDeOutros === true
        ? query(
            collection(
              db,
              gerenteUid ? gerenteUid : currentUser!.uid,
              "data",
              "clientes"
            )
          )
        : query(
            collection(
              db,
              gerenteUid ? gerenteUid : currentUser!.uid,
              "data",
              "clientes"
            ),
            where("criadoPor", "==", collaborator.id)
          );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const costumers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as z.infer<typeof CostumerSchema>),
        }));
        setData(costumers);
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    });
  }, [db, currentUser, collaborator]);

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

  return (
    <div className="p-8 w-full h-screen">
      <h1 className="text-3xl font-bold mb-8">Clientes</h1>

      {data && collaboratorsData ? (
        <CostumersDataTable
          columns={CostumersTableColumns}
          data={data}
          collaborators={collaboratorsData}
        />
      ) : (
        <Loading />
      )}

      <CostumersView />
    </div>
  );
}
