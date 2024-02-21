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
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type DataProps = {
  somaThisDay: number;
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

export default function OperationsDayChart() {
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
    const today = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDay()
    );
    const tomorrow = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDay() + 1
    );

    const q = query(
      collection(db, currentUser!.uid, "data", "operacoes"),
      where("dataDaOperacao", ">=", today),
      where("dataDaOperacao", "<", tomorrow)
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
    const today = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDay()
    );
    const tomorrow = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDay() + 1
    );

    const q = query(
      collection(db, currentUser!.uid, "data", "operacoes"),
      where("dataDaOperacao", ">=", today),
      where("dataDaOperacao", "<", tomorrow)
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
          somaThisDay: thisMonthOperations.length,
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
          <div className="font-medium">Operações (dia)</div>
          <DollarSign className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.somaThisDay}</div>
        <p
          className={`text-xs ${
            data.diferencaPercentual >= 0 ? "text-green-500" : "text-red-600"
          } text-muted-foreground`}
        >
          {data.diferencaPercentual >= 0
            ? "+" + data.diferencaPercentual
            : data.diferencaPercentual}
          % em relação ao mês passado
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