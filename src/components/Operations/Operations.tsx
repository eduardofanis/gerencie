import React from "react";
import { OperationsDataTable } from "./OperationsTable/OperationsDataTable";
import { OperationsTableColumns } from "./OperationsTable/OperationsTableColumns";
import { z } from "zod";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  doc,
  orderBy,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/main";
import { OperationSchema } from "@/schemas/OperationSchema";
import Loading from "../ui/Loading";
import { getUserData } from "@/services/user";
import { CollaboratorContext } from "@/contexts/CollaboratorContext";
import { GetCollaborators } from "@/services/api";
import { UserDataProps } from "@/types/UserDataProps";
import { SubscriberContext } from "@/contexts/SubscriberContext";

export default function Operations() {
  const [data, setData] = React.useState<z.infer<typeof OperationSchema>[]>();
  const [userData, setUserData] = React.useState<UserDataProps>();
  const [collaboratorsData, setCollaboratorsData] = React.useState<
    UserDataProps[]
  >([]);
  const { collaborator } = React.useContext(CollaboratorContext);
  const { subscriber } = React.useContext(SubscriberContext);

  React.useEffect(() => {
    getUserData().then((data) => {
      const db = getFirestore(firebaseApp);
      const { currentUser } = getAuth(firebaseApp);

      const gerenteUid = data!.gerenteUid;

      const q = !collaborator
        ? query(
            collection(
              db,
              gerenteUid ? gerenteUid : currentUser!.uid,
              "data",
              "operacoes"
            ),
            orderBy("createdAt", "desc")
          )
        : collaborator &&
          collaborator.permissions.gerenciarOperacoesDeOutros === true
        ? query(
            collection(
              db,
              gerenteUid ? gerenteUid : currentUser!.uid,
              "data",
              "operacoes"
            ),
            orderBy("createdAt", "desc")
          )
        : query(
            collection(
              db,
              gerenteUid ? gerenteUid : currentUser!.uid,
              "data",
              "operacoes"
            ),
            where("criadoPor", "==", collaborator.id),
            orderBy("createdAt", "desc")
          );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const operations = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as z.infer<typeof OperationSchema>),
        }));
        setData(operations);
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    });
  }, [collaborator]);

  React.useEffect(() => {
    getUserData().then((data) => {
      const gerenteUid = data?.gerenteUid;

      const db = getFirestore(firebaseApp);
      const { currentUser } = getAuth(firebaseApp);

      const unsubscribe = onSnapshot(
        doc(db, gerenteUid ? gerenteUid : currentUser!.uid, "data"),
        (docSnapshot) => {
          setUserData(docSnapshot.data() as UserDataProps);
        }
      );

      return () => {
        if (unsubscribe) unsubscribe();
      };
    });
  }, []);

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
      <h1 className="text-3xl font-bold mb-8">Operações</h1>

      {data && userData && collaboratorsData ? (
        <OperationsDataTable
          columns={OperationsTableColumns}
          data={data}
          userData={userData}
          collaborators={collaboratorsData}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}
