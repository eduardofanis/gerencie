import { UserDataProps } from "@/components/Forms/NewOperationTypeForm";
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
  doc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { CalendarIcon, X } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type DataProps = {
  day: number;
};

type OperationProps = {
  clienteId: string;
  tipoDaOperacao: string;
  statusDaOperacao: string;
  dataDaOperacao: Timestamp;
  promotora: string;
  valorLiberado: number;
  valorRecebido: number;
  comissao: string;
};

type OperationsByDay = {
  [date: string]: { [key: string]: number };
};

type InitialValues = {
  [key: string]: number;
};

export default function IncomeByPeriodChart() {
  const [thisMonthOperations, setThisMonthOperations] =
    React.useState<OperationProps[]>();
  const [data, setData] = React.useState<DataProps[] | null>(null);
  const [data2, setData2] = React.useState<DataProps[] | null>(null);
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [somaValues, setSomaValues] = React.useState<string>();
  const [operationTypes, setOperationTypes] =
    React.useState<UserDataProps | null>();

  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, currentUser!.uid, "data"),
      (docSnapshot) => {
        setOperationTypes(docSnapshot.data() as UserDataProps);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, currentUser]);

  React.useEffect(() => {
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 6
    );
    const lastDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      23,
      59,
      59
    );

    if (date && date.to) {
      date.to.setHours(23);
      date.to.setMinutes(59);
      date.to.setSeconds(59);
    }

    const allDaysArray = [];
    const firstDate = new Date(date && date.from ? date.from : firstDayOfMonth); // Iniciar a partir da data inicial
    const lastDate = new Date(date && date.to ? date.to : lastDayOfMonth);

    // Enquanto a data atual for menor ou igual à data final
    if (
      operationTypes &&
      operationTypes.tiposDeOperacoes &&
      operationTypes.tiposDeOperacoes.length > 0
    ) {
      const initialValues: InitialValues = {};
      operationTypes.tiposDeOperacoes.forEach((operation) => {
        initialValues[operation.name] = 0;
      });
      while (firstDate <= lastDate) {
        allDaysArray.push({
          ...initialValues,
          day: firstDate.getTime(),
        }); // Adicionar o dia atual à array
        firstDate.setDate(firstDate.getDate() + 1); // Avançar para o próximo dia
      }
    } else {
      while (firstDate <= lastDate) {
        allDaysArray.push({
          day: firstDate.getTime(),
        }); // Adicionar o dia atual à array
        firstDate.setDate(firstDate.getDate() + 1); // Avançar para o próximo dia
      }
    }

    setData2(allDaysArray);

    const q = query(
      collection(db, currentUser!.uid, "data", "operacoes"),
      where("dataDaOperacao", ">=", date ? date.from : firstDayOfMonth),
      where("dataDaOperacao", "<=", date && date.to ? date.to : lastDayOfMonth)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const operations = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as OperationProps),
      }));
      setThisMonthOperations(operations);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, currentUser, date, operationTypes]);

  React.useEffect(() => {
    let somaThisMonth = 0;
    if (thisMonthOperations) {
      const thisMonthValues = thisMonthOperations.map((operation) => ({
        [operation.tipoDaOperacao]: operation.valorRecebido,
        day: new Date(operation.dataDaOperacao.toDate().setHours(0, 0, 0, 0)),
      }));

      const thisMonthSomaValues = thisMonthOperations.map(
        (operation) => operation.valorRecebido
      );

      thisMonthSomaValues.map((value) => (somaThisMonth += value));

      setSomaValues(
        Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(somaThisMonth)
      );

      const operationsByDay: OperationsByDay = {};

      // Primeiro, agrupe as operações por dia
      thisMonthValues.forEach((operation) => {
        const day = operation.day.toISOString();

        if (!operationsByDay[day]) {
          operationsByDay[day] = {};
        }

        Object.entries(operation).forEach(([key, value]) => {
          if (key !== "day") {
            operationsByDay[day][key] =
              (operationsByDay[day][key] || 0) + Number(value);
          }
        });
      });

      // Em seguida, crie um array final com os resultados desejados
      const finalArray = Object.entries(operationsByDay).map(
        ([day, operations]) => ({
          ...operations,
          day: new Date(day).getTime(),
        })
      );
      const chartData = mergeArrays(finalArray, data2!);
      setData(chartData);
    }
  }, [thisMonthOperations, date, data2]);

  function mergeArrays(array1: DataProps[], array2: DataProps[]) {
    const mergedArray: DataProps[] = [];

    // Iterar sobre a primeira array
    array1.forEach((obj1) => {
      // Verificar se há um objeto correspondente na segunda array
      const matchingObj = array2.find((obj2) => obj2.day === obj1.day);

      // Se houver um objeto correspondente, mesclar os objetos
      if (matchingObj) {
        mergedArray.push({ ...matchingObj, ...obj1 });
      } else {
        mergedArray.push(obj1);
      }
    });

    // Adicionar objetos da segunda array que não têm correspondência na primeira array
    array2.forEach((obj2) => {
      const matchingObj = array1.find((obj1) => obj1.day === obj2.day);
      if (!matchingObj) {
        mergedArray.push(obj2);
      }
    });

    // Ordenar a array resultante em ordem crescente por 'day'
    mergedArray.sort((a, b) => a.day - b.day);

    return mergedArray;
  }

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

      const mesesAbreviados = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      const dia = new Date(label).getDate();
      const ano = new Date(label).getFullYear();

      const mesIndex = new Date(label).getMonth();
      const mesAbreviado = mesesAbreviados[mesIndex];

      const diaFormatado = `${dia} de ${mesAbreviado}, ${ano}`;

      return (
        <div className="custom-tooltip w-[240px] bg-white py-2 px-4 rounded-lg border shadow-md">
          <div className="flex items-center justify-between border-b pb-1 mb-2">
            <p className="label text-sm font-medium">{diaFormatado}</p>
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

  if (!data || !somaValues) return <Skeleton className="col-span-2" />;
  return (
    <Card className="col-span-2 relative">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Receita por período
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{somaValues}</div>

        <p className="text-xs text-muted-foreground">
          Receita total no período selecionado
        </p>

        <div className="flex items-center gap-2 absolute top-4 right-4">
          {date ? (
            <Button
              variant="outline"
              className="p-3 hover:bg-red-50 border-red-100"
              onClick={() => setDate(undefined)}
            >
              <X className="w-4 h-4 text-red-600" />
            </Button>
          ) : (
            <></>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
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
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                onSelect={setDate}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="h-[360px] mt-8">
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
                tickFormatter={(value) => {
                  const mesesAbreviados = [
                    "Jan",
                    "Fev",
                    "Mar",
                    "Abr",
                    "Mai",
                    "Jun",
                    "Jul",
                    "Ago",
                    "Set",
                    "Out",
                    "Nov",
                    "Dez",
                  ];

                  const dia = new Date(value).getDate();
                  const mesIndex = new Date(value).getMonth();
                  const mesAbreviado = mesesAbreviados[mesIndex];

                  return `${dia} de ${mesAbreviado}`;
                }}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              {operationTypes &&
              operationTypes.tiposDeOperacoes &&
              operationTypes.tiposDeOperacoes.length > 0 ? (
                operationTypes.tiposDeOperacoes.map((type) => (
                  <Line
                    key={type.name + type.color}
                    type="monotone"
                    strokeWidth={2}
                    stroke={type.color}
                    dataKey={type.name}
                  />
                ))
              ) : (
                <></>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
