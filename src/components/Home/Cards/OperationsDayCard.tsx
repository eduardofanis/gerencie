import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { firebaseApp } from "@/main";
import { getUserData } from "@/services/user";
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
  somaThisDay: number;
  diferencaPercentual: number;
};

type OperationsProps = {
  clienteId: string;
  tipoDaOperacao: string;
  statusDaOperacao: string;
  dataDaOperacao: Timestamp;
  promotora: string;
  valorLiberado: number;
  comissao: string;
};

export default function OperationsDayCard() {
  const [todayOperations, setTodayOperations] =
    React.useState<OperationsProps[]>();
  const [yesterdayOperations, setYesterdayOperations] =
    React.useState<OperationsProps[]>();
  const [data, setData] = React.useState<DataProps | null>(null);

  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  React.useEffect(() => {
    getUserData().then((userData) => {
      const gerenteUid = userData?.gerenteUid;

      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const q = query(
        collection(
          db,
          gerenteUid ? gerenteUid : currentUser!.uid,
          "data",
          "operacoes"
        ),
        where("dataDaOperacao", ">=", startOfToday),
        where("dataDaOperacao", "<", endOfToday),
        where("statusDaOperacao", "==", "concluido")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const operations = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as OperationsProps),
        }));
        setTodayOperations(operations);
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    });
  }, [db, currentUser]);

  React.useEffect(() => {
    getUserData().then((userData) => {
      const gerenteUid = userData?.gerenteUid;

      const yesterday = new Date();
      const startOfYesterday = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate() - 1
      );
      const endOfYesterday = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate()
      );

      const q = query(
        collection(
          db,
          gerenteUid ? gerenteUid : currentUser!.uid,
          "data",
          "operacoes"
        ),
        where("dataDaOperacao", ">=", startOfYesterday),
        where("dataDaOperacao", "<", endOfYesterday),
        where("statusDaOperacao", "==", "concluido")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const operations = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as OperationsProps),
        }));
        setYesterdayOperations(operations);
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    });
  }, [db, currentUser]);

  React.useEffect(() => {
    function compareMonths() {
      let diferencaPercentual = 0;
      if (todayOperations && yesterdayOperations) {
        diferencaPercentual =
          ((todayOperations.length - yesterdayOperations.length) /
            yesterdayOperations.length) *
          100;
        setData({
          somaThisDay: todayOperations.length,
          diferencaPercentual: Math.round(diferencaPercentual),
        });
      }
    }
    compareMonths();
  }, [yesterdayOperations, todayOperations]);

  if (!data) return <Skeleton />;
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
            yesterdayOperations!.length > 0 && data.diferencaPercentual > 0
              ? "text-green-500"
              : data.diferencaPercentual < 0
              ? "text-red-600"
              : "text-muted-foreground"
          }`}
        >
          {yesterdayOperations!.length == 0
            ? "Sem dados relacionados ao dia anterior"
            : data.diferencaPercentual > 0
            ? "+" + data.diferencaPercentual + "% em relação ao dia anterior"
            : data.diferencaPercentual < 0
            ? data.diferencaPercentual + "% em relação ao dia anterior"
            : "0% em relação ao dia anterior"}
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
