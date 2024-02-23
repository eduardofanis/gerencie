import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import { DataTable } from "./OperationsTable/data-table";
import { columns } from "./OperationsTable/columns";
import { z } from "zod";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  doc,
  orderBy,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/main";
import { NewOperationFormSchema } from "@/schemas/NewOperationFormSchema";
import Loading from "../ui/Loading";
import { UserDataProps } from "../Forms/NewOperationTypeForm";

export default function Operations() {
  const [data, setData] =
    React.useState<z.infer<typeof NewOperationFormSchema>[]>();
  const [userData, setUserData] = React.useState<UserDataProps>();

  React.useEffect(() => {
    const db = getFirestore(firebaseApp);
    const { currentUser } = getAuth(firebaseApp);

    const q = query(
      collection(db, currentUser!.uid, "data", "operacoes"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const operations = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as z.infer<typeof NewOperationFormSchema>),
      }));
      setData(operations);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    const db = getFirestore(firebaseApp);
    const { currentUser } = getAuth(firebaseApp);

    const unsubscribe = onSnapshot(
      doc(db, currentUser!.uid, "data"),
      (docSnapshot) => {
        setUserData(docSnapshot.data() as UserDataProps);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-8 w-full h-screen">
        <h1 className="text-3xl font-bold mb-8">Operações</h1>

        {data && userData ? (
          <DataTable columns={columns} data={data} userData={userData} />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
