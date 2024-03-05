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
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/main";
import Loading from "../ui/Loading";
import CostumersView from "./CostumersView";

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

  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  React.useEffect(() => {
    const q = query(collection(db, currentUser!.uid, "data", "clientes"));
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
  }, [db, currentUser]);

  return (
    <div className="p-8 w-full h-screen">
      <h1 className="text-3xl font-bold mb-8">Clientes</h1>

      {data ? (
        <CostumersDataTable columns={CostumersTableColumns} data={data} />
      ) : (
        <Loading />
      )}

      <CostumersView />
    </div>
  );
}
