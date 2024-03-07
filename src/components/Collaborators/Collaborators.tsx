import { CollaboratorsDataTable } from "./CollaboratorsTable/CollaboratorsDataTable";
import { CollaboratorsTableColumns } from "./CollaboratorsTable/CollaboratorsTableColumns";
import React from "react";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/main";
import Loading from "../ui/Loading";
import { UserDataProps } from "@/types/UserDataProps";
import { GetCollaborators } from "@/services/api";

export default function Customers() {
  const [data, setData] = React.useState<UserDataProps[]>();

  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, currentUser!.uid, "data"),
      async () => {
        const collaborators = (await GetCollaborators()) as UserDataProps[];
        setData(collaborators || []);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, currentUser]);

  return (
    <div className="p-8 w-full h-screen">
      <h1 className="text-3xl font-bold mb-8">Colaboradores</h1>

      {data ? (
        <CollaboratorsDataTable
          columns={CollaboratorsTableColumns}
          data={data}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}
