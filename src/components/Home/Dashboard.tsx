import {
  Area,
  AreaChart,
  Line,
  LineChart as LineContainer,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TooltipProps } from "recharts";
// for recharts v2.1 and above
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PieChart, Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import IncomeMonthChart from "./Charts/IncomeMonthChart";

const data = [
  {
    FGTS: 4000,
    GOV: 4212,
    PREFEITURA: 4356,
    day: "Seg",
  },
  {
    FGTS: 6000,
    GOV: 3245,
    PREFEITURA: 7453,
    day: "Ter",
  },
  {
    FGTS: 8000,
    GOV: 1234,
    PREFEITURA: 6453,
    day: "Qua",
  },
  {
    FGTS: 10000,
    GOV: 5342,
    PREFEITURA: 4532,
    day: "Qui",
  },
  {
    FGTS: 11000,
    GOV: 3456,
    PREFEITURA: 7543,
    day: "Sex",
  },
  {
    FGTS: 12000,
    GOV: 3568,
    PREFEITURA: 5673,
    day: "Sab",
  },
  {
    FGTS: 13000,
    GOV: 6776,
    PREFEITURA: 5576,
    day: "Dom",
  },
];

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

export default function Dashboard() {
  const [date, setDate] = React.useState<DateRange | undefined>();

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <IncomeMonthChart />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between font-normal">
              <div className="font-medium">Operações (mês)</div>{" "}
              <PieChart className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+56</div>
            <p className="text-xs text-muted-foreground">
              +122.1% em relação ao mês passado
            </p>
            <div className="h-[60px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <Area
                    type="monotone"
                    dataKey="GOV"
                    stroke="#334155"
                    fill="#334155"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between font-normal">
              <div className="font-medium">Operações (dia)</div>{" "}
              <PieChart className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              +180.1% em relação ao dia anterior
            </p>
            <div className="h-[60px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <Area
                    type="monotone"
                    dataKey="PREFEITURA"
                    stroke="#334155"
                    fill="#334155"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between font-normal">
              <div className="font-medium">Clientes</div>{" "}
              <Users className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+56</div>
            <p className="text-xs text-muted-foreground">
              +122.1% em relação ao mês passado
            </p>
            <div className="h-[60px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <Area
                    type="monotone"
                    dataKey="FGTS"
                    stroke="#334155"
                    fill="#334155"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 mt-4 gap-4">
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
            <div className="h-[300px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineContainer
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
                </LineContainer>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 xl:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between font-normal">
              <div className="font-medium">Operaçõoes Recentes</div>{" "}
              <PieChart className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4 flex flex-col">
              <div className="flex items-center justify-between border-b py-2 mb-2">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>E</AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex flex-col">
                    <span>Eduardo Fanis Lima</span>
                    <span className="text-sm text-slate-500">
                      Há 2 horas atrás
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex flex-col text-right">
                  <span className="font-medium">R$ 1200</span>
                  <span className="text-sm text-slate-500">+R$ 120</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b py-2 mb-2">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>E</AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex flex-col">
                    <span>Eduardo Fanis Lima</span>
                    <span className="text-sm text-slate-500">
                      Há 2 horas atrás
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex flex-col text-right">
                  <span className="font-medium">R$ 1200</span>
                  <span className="text-sm text-slate-500">+R$ 120</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b py-2 mb-2">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>E</AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex flex-col">
                    <span>Eduardo Fanis Lima</span>
                    <span className="text-sm text-slate-500">
                      Há 2 horas atrás
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex flex-col text-right">
                  <span className="font-medium">R$ 1200</span>
                  <span className="text-sm text-slate-500">+R$ 120</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b py-2 mb-2">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>E</AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex flex-col">
                    <span>Eduardo Fanis Lima</span>
                    <span className="text-sm text-slate-500">
                      Há 2 horas atrás
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex flex-col text-right">
                  <span className="font-medium">R$ 1200</span>
                  <span className="text-sm text-slate-500">+R$ 120</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b mb-2">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>E</AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex flex-col">
                    <span>Eduardo Fanis Lima</span>
                    <span className="text-sm text-slate-500">
                      Há 2 horas atrás
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex flex-col text-right">
                  <span className="font-medium">R$ 1200</span>
                  <span className="text-sm text-slate-500">+R$ 120</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>E</AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex flex-col">
                    <span>Eduardo Fanis Lima</span>
                    <span className="text-sm text-slate-500">
                      Há 2 horas atrás
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex flex-col text-right">
                  <span className="font-medium">R$ 1200</span>
                  <span className="text-sm text-slate-500">+R$ 120</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
