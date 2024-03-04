import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { firebaseApp } from "@/main";
import { getAuth } from "firebase/auth";
import {
  Timestamp,
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { DollarSign } from "lucide-react";
import React from "react";

type DataProps = {
  somaThisMonth: number;
  diferencaPercentual: number;
};

type ThisMonthDataProps = {
  [key: string]: number;
};

type ThisMonthOperationsProps = {
  clienteId: string;
  tipoDaOperacao: string;
  statusDaOperacao: string;
  dataDaOperacao: Timestamp;
  promotora: string;
  valorLiberado: number;
  comissao: string;
};

export default function OperationsMonthChart() {
  const [thisMonthOperations, setThisMonthOperations] =
    React.useState<ThisMonthOperationsProps[]>();
  const [lastMonthOperations, setLastMonthOperations] =
    React.useState<ThisMonthOperationsProps[]>();
  const [data, setData] = React.useState<DataProps | null>(null);
  const [thisMonthData, setThisMonthData] = React.useState<
    ThisMonthDataProps[] | null
  >(null);

  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  React.useEffect(() => {
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const q = query(
      collection(db, currentUser!.uid, "data", "operacoes"),
      where("dataDaOperacao", ">=", firstDayOfMonth),
      where("dataDaOperacao", "<=", lastDayOfMonth),
      where("statusDaOperacao", "==", "concluido")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const operations = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as ThisMonthOperationsProps),
      }));
      setThisMonthOperations(operations);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, currentUser]);

  React.useEffect(() => {
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    );
    const lastDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      0,
      23,
      59,
      59
    );

    const q = query(
      collection(db, currentUser!.uid, "data", "operacoes"),
      where("dataDaOperacao", ">=", firstDayOfMonth),
      where("dataDaOperacao", "<=", lastDayOfMonth),
      where("statusDaOperacao", "==", "concluido")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const operations = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as ThisMonthOperationsProps),
      }));
      setLastMonthOperations(operations);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, currentUser]);

  React.useEffect(() => {
    function compareMonths() {
      let diferencaPercentual = 0;
      if (thisMonthOperations && lastMonthOperations) {
        diferencaPercentual =
          ((thisMonthOperations.length - lastMonthOperations.length) /
            lastMonthOperations.length) *
          100;
        setData({
          somaThisMonth: thisMonthOperations.length,
          diferencaPercentual: Math.round(diferencaPercentual),
        });
      }
    }
    compareMonths();
  }, [lastMonthOperations, thisMonthOperations]);

  React.useEffect(() => {
    function getDataToCreateChart() {
      if (thisMonthOperations) {
        const thisMonthValues = thisMonthOperations.map((operation) => ({
          value: operation.valorLiberado,
        }));
        setThisMonthData(thisMonthValues);
      }
    }
    getDataToCreateChart();
  }, [thisMonthOperations]);

  if (!data || !thisMonthData) return <Skeleton />;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between font-normal">
          <div className="font-medium">Operações (mês)</div>
          <DollarSign className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.somaThisMonth}</div>
        <p
          className={`text-xs ${
            lastMonthOperations!.length > 0 && data.diferencaPercentual > 0
              ? "text-green-500"
              : data.diferencaPercentual < 0
              ? "text-red-600"
              : "text-muted-foreground"
          }`}
        >
          {lastMonthOperations!.length <= 0
            ? "Sem dados relacionados ao mês anterior"
            : data.diferencaPercentual > 0
            ? "+" + data.diferencaPercentual + "% em relação ao mês anterior"
            : data.diferencaPercentual < 0
            ? data.diferencaPercentual + "% em relação ao mês anterior"
            : "0% em relação ao mês anterior"}
        </p>
        {/* <div className="h-[60px] mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={thisMonthData}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <Area
                type="monotone"
                dataKey="value"
                stroke="#334155"
                fill="#334155"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div> */}
      </CardContent>
    </Card>
  );
}
