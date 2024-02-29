import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { firebaseApp } from "@/main";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  query,
  collection,
  onSnapshot,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { Clock } from "lucide-react";
import React from "react";

type OperationProps = {
  id: string;
  clienteId: string;
  cliente: string;
  dataDaOperacao: number;
  createdAt: Timestamp;
  tipoDaOperacao: string;
  statusDaOperacao: string;
  promotora: string;
  valorLiberado: string;
  valorRecebido: string;
  comissao: string;
};

export default function LastOperationsCard() {
  const [data, setData] = React.useState<OperationProps[] | null>(null);

  React.useEffect(() => {
    const db = getFirestore(firebaseApp);
    const { currentUser } = getAuth(firebaseApp);

    const q = query(
      collection(db, currentUser!.uid, "data", "operacoes"),
      orderBy("createdAt", "desc"),
      limit(6)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const operations = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as OperationProps),
      }));
      setData(operations);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  function formatValue(value: string) {
    const amount = parseFloat(value);
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);

    return formatted;
  }

  function formatTime(time: Timestamp) {
    const agora = Timestamp.now().toMillis(); // Obtém o timestamp atual do Firebase em milissegundos
    const timestamp = time.toMillis(); // Obtém o timestamp fornecido em milissegundos

    const diferenca = agora - timestamp;

    const segundos = Math.floor(diferenca / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
      return `Há ${dias} dia${dias > 1 ? "s" : ""} atrás`;
    } else if (horas > 0) {
      return `Há ${horas} hora${horas > 1 ? "s" : ""} atrás`;
    } else if (minutos > 0) {
      return `Há ${minutos} minuto${minutos > 1 ? "s" : ""} atrás`;
    } else {
      return `Há poucos segundos atrás`;
    }
  }

  if (!data) return <Skeleton className="sm:col-span-2 xl:col-span-1" />;
  return (
    <Card className="sm:col-span-2 xl:col-span-1 relative">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between font-normal">
          <div>
            <div className="font-medium">Operaçõoes Recentes</div>
            <p
              className={`text-sm mt-1 ${
                data.length <= 0 ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              {data.length > 0
                ? `Últimas ${data.length} operações adicionadas.`
                : "Nenhuma operação encontrada"}
            </p>
          </div>
          <Clock className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4 flex flex-col divide-y space-y-3">
          {data.length > 0 &&
            data.map((operations) => (
              <div
                className="flex items-center justify-between pt-3"
                key={operations.id}
              >
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {operations.cliente.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex flex-col">
                    <span>{operations.cliente}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(operations.createdAt)} -{" "}
                      {operations.tipoDaOperacao.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex flex-col text-right">
                  <span className="font-medium">
                    {formatValue(operations.valorLiberado)}
                  </span>
                  <span className="text-sm text-slate-500">
                    +{formatValue(operations.valorRecebido)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
