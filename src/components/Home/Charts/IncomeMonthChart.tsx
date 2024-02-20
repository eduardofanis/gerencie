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
  somaThisMonth: string;
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

export default function IncomeMonthChart() {
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
      0
    );

    const q = query(
      collection(db, currentUser!.uid, "data", "operacoes"),
      where("dataDaOperacao", ">=", firstDayOfMonth),
      where("dataDaOperacao", "<=", lastDayOfMonth)
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
      0
    );

    const q = query(
      collection(db, currentUser!.uid, "data", "operacoes"),
      where("dataDaOperacao", ">=", firstDayOfMonth),
      where("dataDaOperacao", "<=", lastDayOfMonth)
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
      let somaThisMonth = 0;
      let somaLastMonth = 0;
      let diferencaPercentual = 0;
      if (thisMonthOperations && lastMonthOperations) {
        const thisMonthValues = thisMonthOperations.map(
          (operation) => operation.valorLiberado
        );
        const lastMonthValues = lastMonthOperations.map(
          (operation) => operation.valorLiberado
        );
        thisMonthValues.map((value) => (somaThisMonth += value));
        lastMonthValues.map((value) => (somaLastMonth += value));

        diferencaPercentual =
          ((somaThisMonth - somaLastMonth) / somaLastMonth) * 100;
        setData({
          somaThisMonth: Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(somaThisMonth),
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
          [operation.tipoDaOperacao]: operation.valorLiberado,
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
          <div className="font-medium">Receita total (mês)</div>
          <DollarSign className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.somaThisMonth}</div>
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
        <div className="h-[60px] mt-8">
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
        </div>
      </CardContent>
    </Card>
  );
}
