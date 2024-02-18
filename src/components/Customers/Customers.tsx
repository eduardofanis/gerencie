import Sidebar from "../Sidebar/Sidebar";
import { DataTable } from "./CustomersTable/data-table";
import { columns } from "./CustomersTable/columns";
import React from "react";
import { z } from "zod";
import { NewCostumerFormSchema } from "@/schemas/NewCostumerFormSchema";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/main";

export default function Customers() {
  const [data, setData] =
    React.useState<z.infer<typeof NewCostumerFormSchema>[]>();

  function setCostumers() {
    const db = getFirestore(firebaseApp);
    const { currentUser } = getAuth(firebaseApp);

    const q = query(collection(db, currentUser!.uid, "data", "clientes"));
    onSnapshot(q, (querySnapshot) => {
      const costumers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as z.infer<typeof NewCostumerFormSchema>),
      }));
      setData(costumers);
    });
  }

  React.useEffect(() => {
    setCostumers();
  }, []);

  if (!data) return <div>Loading</div>;
  if (data)
    return (
      <div className="flex">
        <Sidebar />
        <div className="p-8 w-full h-screen">
          <h1 className="text-3xl font-bold mb-8">Clientes</h1>

          <DataTable columns={columns} data={data} />
        </div>
      </div>
    );
}
