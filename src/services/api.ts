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
  limit,
} from "firebase/firestore";
import { firebaseApp } from "../main";
import { getAuth } from "firebase/auth";
import { toast } from "../components/ui/use-toast";
import { CostumerSchema } from "../schemas/CostumerSchema";
import { z } from "zod";
import { OperationSchema } from "../schemas/OperationSchema";
import { UserDataProps } from "../components/Forms/NewOperationTypeForm";
import { UseFormReturn } from "react-hook-form";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import {
  CostumerProps,
  OperationProps,
} from "../components/Customers/CostumersView";

export async function NewCostumer(values: z.infer<typeof CostumerSchema>) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);
  const storage = getStorage();

  try {
    if (currentUser && currentUser.uid) {
      const date = values.dataDeNascimento.replace(
        /(\d{2})(\d{2})(\d{4})/,
        "$1/$2/$3"
      );
      const [day, month, year] = date.split("/");
      const dateObject = new Date(`${month}/${day}/${year}`);
      const docRef = await addDoc(
        collection(db, currentUser.uid, "data", "clientes"),
        {
          ...values,
          createdAt: Timestamp.now(),
          dataDeNascimento: dateObject,
          frenteDoDocumento: "",
          versoDoDocumento: "",
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
      if (values.frenteDoDocumento instanceof File) {
        if (values.frenteDoDocumento.type.startsWith("image/")) {
          const frenteRef = ref(
            storage,
            `documentos/${docRef.id}-frente-documento`
          );
          await uploadBytes(frenteRef, values.frenteDoDocumento);
          const frenteURL = await getDownloadURL(frenteRef);
          updateDoc(clienteRef, {
            frenteDoDocumento: frenteURL,
          });
        } else {
          toast({
            title: "Somente imagens são permitidas!",
            variant: "destructive",
            duration: 5000,
          });
        }
      }

      if (values.versoDoDocumento instanceof File) {
        if (values.versoDoDocumento.type.startsWith("image/")) {
          const versoRef = ref(
            storage,
            `documentos/${docRef.id}-verso-documento`
          );

          await uploadBytes(versoRef, values.versoDoDocumento);

          // Obtém o URL do arquivo enviado (verso)
          const versoURL = await getDownloadURL(versoRef);
          updateDoc(clienteRef, {
            versoDoDocumento: versoURL,
          });
        } else {
          toast({
            title: "Somente imagens são permitidas!",
            variant: "destructive",
            duration: 5000,
          });
        }
      }
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

export async function EditCostumer(
  values: z.infer<typeof CostumerSchema>,
  id: string
) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);
  // const storage = getStorage();

  try {
    if (currentUser && currentUser.uid) {
      const date = values.dataDeNascimento.replace(
        /(\d{2})(\d{2})(\d{4})/,
        "$1/$2/$3"
      );
      const [day, month, year] = date.split("/");
      const dateObject = new Date(`${month}/${day}/${year}`);
      await updateDoc(doc(db, currentUser.uid, "data", "clientes", id), {
        ...values,
        dataDeNascimento: dateObject,
        frenteDoDocumento: "",
        versoDoDocumento: "",
      });
      toast({
        title: "Cliente editado com sucesso!",
        variant: "success",
        duration: 5000,
      });
      // if (values.frenteDoDocumento instanceof File) {
      //   if (values.frenteDoDocumento.type.startsWith("image/")) {
      //     const frenteRef = ref(
      //       storage,
      //       `documentos/${docRef.id}-frente-documento`
      //     );
      //     await uploadBytes(frenteRef, values.frenteDoDocumento);
      //     const frenteURL = await getDownloadURL(frenteRef);
      //     updateDoc(clienteRef, {
      //       frenteDoDocumento: frenteURL,
      //     });
      //   } else {
      //     toast({
      //       title: "Somente imagens são permitidas!",
      //       variant: "destructive",
      //       duration: 5000,
      //     });
      //   }
      // }

      // if (values.versoDoDocumento instanceof File) {
      //   if (values.versoDoDocumento.type.startsWith("image/")) {
      //     const versoRef = ref(
      //       storage,
      //       `documentos/${docRef.id}-verso-documento`
      //     );

      //     await uploadBytes(versoRef, values.versoDoDocumento);

      //     // Obtém o URL do arquivo enviado (verso)
      //     const versoURL = await getDownloadURL(versoRef);
      //     updateDoc(clienteRef, {
      //       versoDoDocumento: versoURL,
      //     });
      //   } else {
      //     toast({
      //       title: "Somente imagens são permitidas!",
      //       variant: "destructive",
      //       duration: 5000,
      //     });
      //   }
      // }
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
  values: z.infer<typeof OperationSchema>,
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
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (
          data &&
          data.tiposDeOperacoes &&
          Array.isArray(data.tiposDeOperacoes)
        ) {
          // Verifica se algum objeto na array possui a chave e valor especificados
          const objetoEncontrado = data.tiposDeOperacoes.some(
            (obj) => obj["name"] === name
          );

          if (objetoEncontrado) {
            toast({
              title: "Você já possui um tipo de operação com este nome!",
              variant: "destructive",
              duration: 5000,
            });
          } else {
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
        }
      }
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

      const operacoesSnapshot = await getDocs(
        query(
          collection(db, currentUser.uid, "data", "operacoes"),
          where("tipoDaOperacao", "==", name)
        )
      );
      operacoesSnapshot.forEach(async (doc) => {
        deleteDoc(doc.ref);
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
      const costumers = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as z.infer<typeof CostumerSchema>),
      }));

      return costumers;
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log();
  }
}

export async function GetCostumer(clienteId: string) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      const docRef = await getDoc(
        doc(db, currentUser!.uid, "data", "clientes", clienteId)
      );
      const costumer = docRef.data() as CostumerProps;

      return costumer;
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log();
  }
}

export async function GetCostumerOperations(
  clienteId: string,
  operationLimit?: number
) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      const queryRef = operationLimit
        ? query(
            collection(db, currentUser!.uid, "data", "operacoes"),
            where("clienteId", "==", clienteId),
            limit(operationLimit)
          )
        : query(
            collection(db, currentUser!.uid, "data", "operacoes"),
            where("clienteId", "==", clienteId)
          );
      const querySnapshot = await getDocs(queryRef);
      const operations = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as OperationProps),
      }));

      return operations;
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
  const storage = getStorage();

  const partes = clienteId.split("-");
  const id = partes.slice(1).join("-");

  const storageRef = ref(storage, `documentos`);
  const frenteName = `${id}-frente-documento`;
  const versoName = `${id}-verso-documento`;

  try {
    if (currentUser && currentUser.uid) {
      const clienteRef = doc(db, currentUser.uid, "data", "clientes", id);

      await deleteDoc(clienteRef);

      try {
        const fileList = await listAll(storageRef);
        const frenteExists = fileList.items.some(
          (item) => item.name === frenteName
        );
        const versoExists = fileList.items.some(
          (item) => item.name === versoName
        );

        if (frenteExists) {
          const fileRef = ref(storage, `documentos/${frenteName}`);
          await deleteObject(fileRef);
        }
        if (versoExists) {
          const fileRef = ref(storage, `documentos/${versoName}`);
          await deleteObject(fileRef);
        }
      } catch (error) {
        toast({
          title: "Erro ao remover documentos!",
          variant: "destructive",
          duration: 5000,
        });
      }

      if (removerOperacoes) {
        try {
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
        } catch (error) {
          toast({
            title: "Erro ao remover as operações!",
            variant: "destructive",
            duration: 5000,
          });
        }
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

type CepProps = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ddd: string;
  erro: boolean;
};

export async function fetchCep(
  cep: string,
  form: UseFormReturn<z.infer<typeof CostumerSchema>>
) {
  try {
    if (cep.length == 8) {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data: CepProps = await response.json();
      form.setValue("rua", data.logradouro);
      form.setValue("bairro", data.bairro);
      form.setValue("cidade", data.localidade);
      form.setValue("estado", data.uf);

      if (data && data.erro) {
        toast({
          title: "Insira um CEP válido!",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  } catch (error) {
    toast({
      title: "Erro ao buscar cep!",
      description: "Por favor, tente novamente.",
      variant: "destructive",
      duration: 5000,
    });
  }
}
