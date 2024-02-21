import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { firebaseApp } from "@/main";
import { format } from "date-fns";
import { getAuth } from "firebase/auth";
import {
  Timestamp,
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { CalendarIcon, DollarSign } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DataProps = {
  somaThisMonth: string;
  diferencaPercentual: number;
};

type ThisMonthDataProps = {
  [key: string]: number;
  day: number;
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

export default function IncomeByPeriodChart() {
  const [thisMonthOperations, setThisMonthOperations] =
    React.useState<ThisMonthOperationsProps[]>();
  const [lastMonthOperations, setLastMonthOperations] =
    React.useState<ThisMonthOperationsProps[]>();
  const [data, setData] = React.useState<DataProps | null>(null);
  const [thisMonthData, setThisMonthData] = React.useState<
    ThisMonthDataProps[] | null
  >(null);
  const [date, setDate] = React.useState<DateRange | undefined>();

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

  function CustomTooltip({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) {
    if (active && payload && payload.length) {
      let soma = 0;
      const somaDosValores = payload.map((pld) => {
        soma += Number(pld.value);
        return soma;
      });

      return (
        <div className="custom-tooltip w-[240px] bg-white py-2 px-4 rounded-lg border shadow-md">
          <div className="flex items-center justify-between border-b pb-1 mb-2">
            <p className="label text-sm font-medium">{label}</p>
            <span className="font-medium">
              R$ {somaDosValores[somaDosValores.length - 1]}
            </span>
          </div>

          <div>
            {payload.map((pld) => (
              <div
                key={payload.indexOf(pld)}
                className="text-sm"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: pld.color }}
                    className="h-2 w-2 rounded-full"
                  ></div>
                  <span className="text-slate-500">{pld.dataKey}</span>
                </div>
                <div>R$ {pld.value}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  }

  if (!data || !thisMonthData) return <Skeleton />;
  return (
    <Card className="col-span-2 relative">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Receita por período
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">R$ 15.231,89</div>
        <p className="text-xs text-muted-foreground">
          Receita total no período selecionado
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "justify-start text-left font-normal absolute top-4 right-4",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Selecione um período</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              selected={date}
              defaultMonth={date?.from}
              onSelect={setDate}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
        <div className="h-[440px] mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: 5,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="day"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                strokeWidth={2}
                stroke="#0284c7"
                dataKey="FGTS"
              />
              <Line
                type="monotone"
                strokeWidth={2}
                stroke="#16a34a"
                dataKey="GOV"
              />
              <Line
                type="monotone"
                strokeWidth={2}
                stroke="#4f46e5"
                dataKey="PREFEITURA"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
