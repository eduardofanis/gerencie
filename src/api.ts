import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import { firebaseApp } from "./main";
import { getAuth } from "firebase/auth";
import { toast } from "./components/ui/use-toast";

type ConsumerProps = {
  nome: string;
  cpf: string;
  nascimento: string;
  sexo: string;
  estadoCivil: string;
  naturalidade: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento: string;
  estado: string;
  cidade: string;
  bairro: string;
  tipoDocumento: string;
  frenteDocumento: string | null;
  versoDocumento: string | null;
  tipoOperacao: string;
  statusOperacao: string;
  dataOperacao: Date | undefined;
  valorLiberado: string;
  comissao: string;
};

export async function NewConsumer({
  nome,
  cpf,
  nascimento,
  sexo,
  estadoCivil,
  naturalidade,
  telefone,
  rua,
  numero,
  complemento,
  estado,
  cidade,
  bairro,
  tipoDocumento,
  frenteDocumento,
  versoDocumento,
  tipoOperacao,
  statusOperacao,
  dataOperacao,
  valorLiberado,
  comissao,
}: ConsumerProps) {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  try {
    if (currentUser && currentUser.uid) {
      await addDoc(collection(db, currentUser.uid, "data", "clientes"), {
        nome: nome,
        cpf: cpf,
        nascimento: nascimento,
        sexo: sexo,
        estadoCivil: estadoCivil,
        naturalidade: naturalidade,
        telefone: telefone,
        rua: rua,
        numero: numero,
        complemento: complemento,
        estado: estado,
        cidade: cidade,
        bairro: bairro,
        tipoDocumento: tipoDocumento,
        frenteDocumento: frenteDocumento,
        versoDocumento: versoDocumento,
        tipoOperacao: tipoOperacao,
        statusOperacao: statusOperacao,
        dataOperacao: dataOperacao,
        valorLiberado: valorLiberado,
        comissao: comissao,
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

export async function GetConsumers() {
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  if (currentUser && currentUser.uid) {
    const querySnapshot = await getDocs(
      collection(db, currentUser.uid, "data", "clientes")
    );
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  }
}
