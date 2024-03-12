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
  setDoc,
} from "firebase/firestore";
import { firebaseApp } from "../main";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { toast } from "../components/ui/use-toast";
import { CostumerSchema } from "../schemas/CostumerSchema";
import { z } from "zod";
import { OperationSchema } from "../schemas/OperationSchema";
import { UseFormReturn } from "react-hook-form";
import { deleteObject, getStorage, ref } from "firebase/storage";
import {
  CostumerProps,
  OperationProps,
} from "../components/Customers/CostumersView";
import { CollaboratorSchema } from "@/schemas/CollaboratorSchema";
import { firebaseConfig } from "@/FirebaseSettings";
import { FirebaseError, initializeApp } from "firebase/app";
import { getUserData } from "./user";
import { UserDataProps } from "@/types/UserDataProps";
import { Collaborator } from "@/contexts/CollaboratorContext";

export async function NewCostumer(values: z.infer<typeof CostumerSchema>) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      const data = await getUserData();
      const gerenteUid = data?.gerenteUid;
      const date = values.dataDeNascimento.replace(
        /(\d{2})(\d{2})(\d{4})/,
        "$1/$2/$3"
      );
      const [day, month, year] = date.split("/");
      const dateObject = new Date(`${month}/${day}/${year}`);
      const docRef = await addDoc(
        collection(
          db,
          gerenteUid ? gerenteUid : currentUser.uid,
          "data",
          "clientes"
        ),
        {
          ...values,
          createdAt: Timestamp.now(),
          dataDeNascimento: dateObject,
          criadoPor: currentUser.uid,
          telefone: values.telefone.replace(/\D/g, ""),
          anexos: [],
        }
      );
      const clienteRef = doc(
        db,
        gerenteUid ? gerenteUid : currentUser!.uid,
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

export async function EditCostumer(
  values: z.infer<typeof CostumerSchema>,

  id: string
) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      const data = await getUserData();
      const gerenteUid = data?.gerenteUid;
      const date = values.dataDeNascimento.replace(
        /(\d{2})(\d{2})(\d{4})/,
        "$1/$2/$3"
      );
      const [day, month, year] = date.split("/");
      const dateObject = new Date(`${month}/${day}/${year}`);
      const docRef = getDoc(
        doc(
          db,
          gerenteUid ? gerenteUid : currentUser.uid,
          "data",
          "clientes",
          id
        )
      );
      const docData = (await docRef).data() as CostumerProps;
      const oldName = docData.nome;

      const queryRef = query(
        collection(
          db,
          gerenteUid ? gerenteUid : currentUser!.uid,
          "data",
          "operacoes"
        ),
        where("clienteId", "==", `${oldName}-${id}`)
      );

      const querySnapshot = await getDocs(queryRef);
      querySnapshot.docs.forEach((doc) => {
        updateDoc(doc.ref, {
          cliente: values.nome,
          clienteId: `${values.nome}-${id}`,
        });
      });

      const clienteRef = doc(
        db,
        gerenteUid ? gerenteUid : currentUser.uid,
        "data",
        "clientes",
        id
      );

      await updateDoc(clienteRef, {
        ...values,
        id: `${values.nome}-${id}`,
        dataDeNascimento: dateObject,
      });
      toast({
        title: "Cliente editado com sucesso!",
        variant: "success",
        duration: 5000,
      });
    }
  } catch (error) {
    console.error(error);
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

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  try {
    if (currentUser && currentUser.uid) {
      const docRef = await addDoc(
        collection(
          db,
          gerenteUid ? gerenteUid : currentUser.uid,
          "data",
          "operacoes"
        ),
        {
          ...values,
          createdAt: Timestamp.now(),
          criadoPor: currentUser.uid,
          valorRecebido: (values.valorLiberado * Number(values.comissao)) / 100,
        }
      );
      const operationRef = doc(
        db,
        gerenteUid ? gerenteUid : currentUser!.uid,
        "data",
        "operacoes",
        docRef.id
      );
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

export async function EditOperation(
  values: z.infer<typeof OperationSchema>,
  nomeDoCliente: string,
  id: string
) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  try {
    if (currentUser && currentUser.uid) {
      console.log(values, id, nomeDoCliente);
      await updateDoc(
        doc(
          db,
          gerenteUid ? gerenteUid : currentUser.uid,
          "data",
          "operacoes",
          id
        ),
        {
          ...values,
          cliente: nomeDoCliente,
          valorRecebido: (values.valorLiberado * Number(values.comissao)) / 100,
        }
      );
      toast({
        title: "Operação editada com sucesso!",
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

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  try {
    if (currentUser && currentUser.uid) {
      const docRef = doc(db, gerenteUid ? gerenteUid : currentUser.uid, "data");
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

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  try {
    if (currentUser && currentUser.uid) {
      const docRef = doc(db, gerenteUid ? gerenteUid : currentUser.uid, "data");
      await updateDoc(docRef, {
        tiposDeOperacoes: arrayRemove({
          name: name,
          color: color,
        }),
      });

      const operacoesSnapshot = await getDocs(
        query(
          collection(
            db,
            gerenteUid ? gerenteUid : currentUser.uid,
            "data",
            "operacoes"
          ),
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

export async function GetCostumers(collaborator?: Collaborator) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  try {
    if (currentUser && currentUser.uid) {
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

      const querySnapshot = await getDocs(q);
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

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  try {
    if (currentUser && currentUser.uid) {
      const docRef = await getDoc(
        doc(
          db,
          gerenteUid ? gerenteUid : currentUser!.uid,
          "data",
          "clientes",
          clienteId
        )
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

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  try {
    if (currentUser && currentUser.uid) {
      const queryRef = operationLimit
        ? query(
            collection(
              db,
              gerenteUid ? gerenteUid : currentUser!.uid,
              "data",
              "operacoes"
            ),
            where("clienteId", "==", clienteId),
            limit(operationLimit)
          )
        : query(
            collection(
              db,
              gerenteUid ? gerenteUid : currentUser!.uid,
              "data",
              "operacoes"
            ),
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

export async function GetOperation(id: string) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  try {
    if (currentUser && currentUser.uid) {
      const docRef = await getDoc(
        doc(
          db,
          gerenteUid ? gerenteUid : currentUser!.uid,
          "data",
          "operacoes",
          id
        )
      );
      const operation = docRef.data() as OperationProps;

      return operation;
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

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  try {
    if (currentUser && currentUser.uid) {
      const docRef = doc(
        db,
        gerenteUid ? gerenteUid : currentUser.uid,
        "data",
        "operacoes",
        operationId
      );

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

export async function getOperationTypes() {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  try {
    if (currentUser && currentUser.uid) {
      const docRef = await getDoc(
        doc(db, gerenteUid ? gerenteUid : currentUser.uid, "data")
      );
      const docData = docRef.data() as UserDataProps;

      const operations: string[] = [];

      if (docData && docData.tiposDeOperacoes) {
        if (docData.tiposDeOperacoes.length > 0) {
          return docData.tiposDeOperacoes.forEach((operationType) =>
            operations.push(operationType.name)
          );
        }
      }
      return operations;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function DeleteCostumer(
  clienteId: string,
  removerOperacoes: boolean
) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);
  const storage = getStorage();

  const fullId = clienteId.split("-");
  const id = fullId.slice(1).join("-");

  try {
    if (currentUser && currentUser.uid) {
      const data = await getUserData();
      const gerenteUid = data?.gerenteUid;
      const clienteRef = doc(
        db,
        gerenteUid ? gerenteUid : currentUser.uid,
        "data",
        "clientes",
        id
      );

      const docData = (await getDoc(clienteRef)).data() as CostumerProps;
      if (docData.anexos && docData.anexos.length > 0) {
        docData.anexos.forEach(async (anexo) => {
          await deleteObject(ref(storage, `documentos/${id}-${anexo.name}`));
        });
      }

      await deleteDoc(clienteRef);

      if (removerOperacoes) {
        try {
          const operacoesQuery = query(
            collection(
              db,
              gerenteUid ? gerenteUid : currentUser.uid,
              "data",
              "operacoes"
            ),
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

export async function NewCollaborator(
  values: z.infer<typeof CollaboratorSchema>
) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  const secondaryApp = initializeApp(firebaseConfig, "Secondary");
  const auth = getAuth(secondaryApp);

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  try {
    if (currentUser && currentUser.uid) {
      if (values.password !== values.confirmPassword) {
        toast({
          title: "As senhas precisam ser iguais.",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        if (values.password.length < 6 || values.confirmPassword.length < 6) {
          toast({
            title: "A senha precisa ter mais de 6 dígitos.",
            variant: "destructive",
            duration: 5000,
          });
        } else {
          const { user } = await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );
          await signOut(auth);
          await updateProfile(user, {
            displayName: values.nome,
          });

          const docSnapshot = await getDoc(
            doc(db, gerenteUid ? gerenteUid : currentUser.uid, "data")
          );
          const userPlan = docSnapshot.data()?.plano;

          if (userPlan)
            await setDoc(doc(db, user.uid, "data"), {
              avatar: "",
              id: user.uid,
              gerenteUid: currentUser.uid,
              nome: values.nome,
              telefone: values.telefone,
              email: user.email,
              permissoes: {
                visaoEstatisticasDeTodos: false,
                gerenciarOperacoesDeOutros: false,
                gerenciarClientesDeOutros: false,
                gerenciarTipoDeOperacoes: false,
                gerenciarColaboradores: false,
                gerenciarAutomacoes: false,
              },
            });

          const docRef = doc(db, currentUser.uid, "data");

          await updateDoc(docRef, {
            colaboradores: arrayUnion({
              uid: user.uid,
            }),
          });
          toast({
            title: "Colaborador criado com sucesso!",
            variant: "success",
            duration: 5000,
          });
        }
      }
    }
  } catch (e) {
    if (e instanceof FirebaseError && e.code == "auth/email-already-in-use") {
      toast({
        title: "Este e-mail já está em uso.",
        variant: "destructive",
        duration: 5000,
      });
    } else {
      toast({
        title: "Algo deu errado, tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }
}

export async function GetCollaborators() {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  try {
    if (currentUser && currentUser.uid) {
      const querySnapshot = await getDoc(
        doc(db, gerenteUid ? gerenteUid : currentUser.uid, "data")
      );
      const userData = querySnapshot.data() as UserDataProps;
      const colaboradores = userData?.colaboradores;

      if (colaboradores && colaboradores.length > 0) {
        const promises = colaboradores.map(async (colaborador) => {
          const docRef = doc(db, colaborador.uid, "data");
          const docSnap = await getDoc(docRef);
          return docSnap.data() as UserDataProps;
        });

        const list = await Promise.all(promises);
        return list;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function DeleteCollaborator(
  colaboradorId: string,
  email: string,
  password: string
) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  const data = await getUserData();
  const gerenteUid = data?.gerenteUid;

  const secondaryApp = initializeApp(firebaseConfig, "Secondary");
  const secondaryAuth = getAuth(secondaryApp);

  try {
    if (currentUser && currentUser.uid) {
      if (colaboradorId === currentUser.uid) {
        toast({
          title: "O colaborador não pode ser excluído!",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      const docRef = doc(db, gerenteUid ? gerenteUid : currentUser.uid, "data");

      await signInWithEmailAndPassword(secondaryAuth, email, password);
      if (secondaryAuth.currentUser)
        await deleteUser(secondaryAuth.currentUser);
      await signOut(secondaryAuth);

      await updateDoc(docRef, {
        colaboradores: arrayRemove({ uid: colaboradorId }),
      });

      const operations = await getDocs(
        query(
          collection(
            db,
            gerenteUid ? gerenteUid : currentUser!.uid,
            "data",
            "operacoes"
          ),
          where("criadoPor", "==", colaboradorId)
        )
      );
      operations.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          criadoPor: gerenteUid ? gerenteUid : currentUser!.uid,
        });
      });

      const costumers = await getDocs(
        query(
          collection(
            db,
            gerenteUid ? gerenteUid : currentUser!.uid,
            "data",
            "clientes"
          ),
          where("criadoPor", "==", colaboradorId)
        )
      );
      costumers.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          criadoPor: gerenteUid ? gerenteUid : currentUser!.uid,
        });
      });

      const querySnapshot = await getDocs(collection(db, colaboradorId));
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      toast({
        title: "Colaborador deletado com sucesso!",
        variant: "success",
        duration: 5000,
      });
    }
  } catch (error) {
    if (
      error instanceof FirebaseError &&
      error.code == "auth/invalid-credential"
    ) {
      toast({
        title: "Senha incorreta!",
        variant: "destructive",
        duration: 5000,
      });
    } else {
      toast({
        title: "Algo deu errado, tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    }
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
