import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  where,
  query,
  Timestamp,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { firebaseApp } from "./main";
import { getAuth } from "firebase/auth";
import { toast } from "./components/ui/use-toast";
import { NewCostumerFormSchema } from "./schemas/NewCostumerFormSchema";
import { z } from "zod";
import { NewOperationFormSchema } from "./schemas/NewOperationFormSchema";
import { UserDataProps } from "./components/Forms/NewOperationTypeForm";

export async function NewCostumer(
  values: z.infer<typeof NewCostumerFormSchema>
) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      const docRef = await addDoc(
        collection(db, currentUser.uid, "data", "clientes"),
        {
          ...values,
          createdAt: Timestamp.now(),
          dataDeNascimento: Date.parse(values.dataDeNascimento),
        }
      );
      const clienteRef = doc(
        db,
        currentUser!.uid,
        "data",
        "clientes",
        docRef.id
      );
      updateDoc(clienteRef, { id: `${values.nome}-${docRef.id}` });
      toast({
        title: "Cliente cadastrado com sucesso!",
        variant: "success",
        duration: 5000,
      });
    }
  } catch (error) {
    console.log(error);
    toast({
      title: "Algo deu errado, tente novamente!",
      variant: "destructive",
      duration: 5000,
    });
  }
}

export async function NewOperation(
  values: z.infer<typeof NewOperationFormSchema>,
  nomeDoCliente: string
) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      const docRef = await addDoc(
        collection(db, currentUser.uid, "data", "operacoes"),
        {
          ...values,
          createdAt: Timestamp.now(),
          valorRecebido: (values.valorLiberado * Number(values.comissao)) / 100,
        }
      );
      const operationRef = doc(
        db,
        currentUser!.uid,
        "data",
        "operacoes",
        docRef.id
      );
      console.log(nomeDoCliente);
      updateDoc(operationRef, { id: docRef.id, cliente: nomeDoCliente });
      toast({
        title: "Operação cadastrada com sucesso!",
        variant: "success",
        duration: 5000,
      });
    }
  } catch (error) {
    console.log(error);
    toast({
      title: "Algo deu errado, tente novamente!",
      variant: "destructive",
      duration: 5000,
    });
  }
}

export async function NewOperationType(name: string, color: string) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      const docRef = doc(db, currentUser.uid, "data");
      await updateDoc(docRef, {
        tiposDeOperacoes: arrayUnion({
          name: name,
          color: color,
        }),
      });
      toast({
        title: "Tipo de Operação adicionado com sucesso!",
        variant: "success",
        duration: 5000,
      });
    }
  } catch (error) {
    console.log(error);
    toast({
      title: "Algo deu errado, tente novamente!",
      variant: "destructive",
      duration: 5000,
    });
  }
}

export async function RemoveOperationType(name: string, color: string) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      const docRef = doc(db, currentUser.uid, "data");
      await updateDoc(docRef, {
        tiposDeOperacoes: arrayRemove({
          name: name,
          color: color,
        }),
      });
      toast({
        title: "Tipo de Operação removido com sucesso!",
        variant: "success",
        duration: 5000,
      });
    }
  } catch (error) {
    console.log(error);
    toast({
      title: "Algo deu errado, tente novamente!",
      variant: "destructive",
      duration: 5000,
    });
  }
}

export async function GetCostumers() {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      const querySnapshot = await getDocs(
        collection(db, currentUser!.uid, "data", "clientes")
      );
      const consumers = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as z.infer<typeof NewCostumerFormSchema>),
      }));

      return consumers;
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log();
  }
}

export async function getUserData() {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      const querySnapshot = await getDoc(doc(db, currentUser!.uid, "data"));
      const consumers = querySnapshot.data() as UserDataProps;

      return consumers;
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log();
  }
}

export async function DeleteOperation(operationId: string) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      const docRef = doc(db, currentUser.uid, "data", "operacoes", operationId);

      await deleteDoc(docRef);

      toast({
        title: "Operação excluída com sucesso!",
        variant: "success",
        duration: 5000,
      });
    }
  } catch (error) {
    console.error(error);
    toast({
      title: "Erro ao excluir documento.",
      variant: "destructive",
      duration: 5000,
    });
    throw error;
  }
}

export async function DeleteCostumer(
  clienteId: string,
  removerOperacoes: boolean
) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  const partes = clienteId.split("-");
  const restante = partes.slice(1).join("-");

  try {
    if (currentUser && currentUser.uid) {
      const clienteRef = doc(db, currentUser.uid, "data", "clientes", restante);

      await deleteDoc(clienteRef);

      if (removerOperacoes) {
        const operacoesQuery = query(
          collection(db, currentUser.uid, "data", "operacoes"),
          where("clienteId", "==", clienteId)
        );
        const operacoesSnapshot = await getDocs(operacoesQuery);
        operacoesSnapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });

        toast({
          title: "Cliente e operações excluídos com sucesso!",
          variant: "success",
          duration: 5000,
        });
      } else {
        toast({
          title: "Cliente excluído com sucesso!",
          variant: "success",
          duration: 5000,
        });
      }
    }
  } catch (error) {
    console.error(error);
    toast({
      title: "Erro ao excluir documento.",
      variant: "destructive",
      duration: 5000,
    });
    throw error;
  }
}
