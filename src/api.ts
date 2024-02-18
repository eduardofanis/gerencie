import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import { firebaseApp } from "./main";
import { getAuth } from "firebase/auth";
import { toast } from "./components/ui/use-toast";
import { NewCostumerFormSchema } from "./schemas/NewCostumerFormSchema";
import { z } from "zod";

export async function NewConsumer({
  nome,
  cpf,
  dataDeNascimento,
  sexo,
  estadoCivil,
  naturalidade,
  telefone,
  rua,
  numeroDaRua,
  complemento,
  estado,
  cidade,
  bairro,
  tipoDoDocumento,
  frenteDoDocumento,
  versoDoDocumento,
}: z.infer<typeof NewCostumerFormSchema>) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      await addDoc(collection(db, currentUser.uid, "data", "clientes"), {
        nome: nome,
        cpf: cpf,
        dataDeNascimento: Date.parse(dataDeNascimento),
        sexo: sexo,
        estadoCivil: estadoCivil,
        naturalidade: naturalidade,
        telefone: telefone,
        rua: rua,
        numeroDaRua: numeroDaRua,
        complemento: complemento,
        estado: estado,
        cidade: cidade,
        bairro: bairro,
        tipoDoDocumento: tipoDoDocumento,
        frenteDoDocumento: frenteDoDocumento,
        versoDoDocumento: versoDoDocumento,
      });
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

export async function GetCostumers() {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      const querySnapshot = await getDocs(
        collection(db, currentUser!.uid, "data", "clientes")
      );
      const consumers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
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
