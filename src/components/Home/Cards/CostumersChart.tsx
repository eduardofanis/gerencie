import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { firebaseApp } from "@/main";
import { getAuth } from "firebase/auth";
import {
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

type CostumerProps = {
  id: string;
  nome: string;
};

export default function CostumersChart() {
  const [thisMonthCostumers, setThisMonthCostumers] =
    React.useState<CostumerProps[]>();
  const [lastMonthCostumers, setLastMonthCostumers] =
    React.useState<CostumerProps[]>();
  const [data, setData] = React.useState<DataProps | null>(null);

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
      collection(db, currentUser!.uid, "data", "clientes"),
      where("createdAt", ">=", firstDayOfMonth),
      where("createdAt", "<=", lastDayOfMonth)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const costumers = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as CostumerProps),
      }));
      setThisMonthCostumers(costumers);
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
      collection(db, currentUser!.uid, "data", "clientes"),
      where("createdAt", ">=", firstDayOfMonth),
      where("createdAt", "<=", lastDayOfMonth)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const costumers = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as CostumerProps),
      }));
      setLastMonthCostumers(costumers);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, currentUser]);

  React.useEffect(() => {
    function compareMonths() {
      let diferencaPercentual = 0;
      if (thisMonthCostumers && lastMonthCostumers) {
        diferencaPercentual =
          ((thisMonthCostumers.length - lastMonthCostumers.length) /
            lastMonthCostumers.length) *
          100;
        setData({
          somaThisMonth: thisMonthCostumers.length,
          diferencaPercentual: Math.round(
            diferencaPercentual == Infinity ? 0 : diferencaPercentual
          ),
        });
      }
    }
    compareMonths();
  }, [lastMonthCostumers, thisMonthCostumers]);

  if (!data) return <Skeleton />;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between font-normal">
          <div className="font-medium">Clientes (mês)</div>
          <DollarSign className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.somaThisMonth}</div>
        <p
          className={`text-xs ${
            data.diferencaPercentual > 0
              ? "text-green-500"
              : data.diferencaPercentual < 0
              ? "text-red-600"
              : "text-muted-foreground"
          }`}
        >
          {lastMonthCostumers!.length <= 0
            ? "Sem dados relacionados ao mês anterior"
            : data.diferencaPercentual > 0
            ? "+" + data.diferencaPercentual + "% em relação ao mês passado"
            : data.diferencaPercentual < 0
            ? data.diferencaPercentual + "% em relação ao mês passado"
            : "Nenhuma diferença em relação ao mês passado"}
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
