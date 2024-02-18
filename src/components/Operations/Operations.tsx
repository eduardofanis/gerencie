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
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/main";
import { NewOperationFormSchema } from "@/schemas/NewOperationFormSchema";

export default function Operations() {
  const [data, setData] =
    React.useState<z.infer<typeof NewOperationFormSchema>[]>();

  function getOperations() {
    const db = getFirestore(firebaseApp);
    const { currentUser } = getAuth(firebaseApp);

    const q = query(collection(db, currentUser!.uid, "data", "clientes"));
    onSnapshot(q, (querySnapshot) => {
      const operations = querySnapshot.docs.flatMap((doc) => {
        const operacoes = doc.data().operacoes as z.infer<
          typeof NewOperationFormSchema
        >;
        return operacoes ? operacoes : [];
      });
      setData(operations);
    });
  }

  React.useEffect(() => {
    getOperations();
  }, []);

  if (!data) return <div>Loading!</div>;

  if (data)
    return (
      <div className="flex">
        <Sidebar />
        <div className="p-8 w-full h-screen">
          <h1 className="text-3xl font-bold mb-8">Operações</h1>

          <DataTable columns={columns} data={data} />
        </div>
      </div>
    );
}
