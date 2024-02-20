import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
import { PieChart, Users } from "lucide-react";

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

export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip w-[240px] bg-white py-2 px-4 rounded-lg border shadow-md">
        <p className="label text-sm border-b pb-1 mb-2">{label}</p>
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
};

export default function LineChart() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="xl:col-span-3 sm:col-span-2 row-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-normal">Visão semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 15.231,89</div>
          <p className="text-xs text-muted-foreground">+20.1% do mês passado</p>
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between font-normal">
            <div>Clientes</div> <Users className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12</div>
          <p className="text-xs text-muted-foreground">
            +180.1% do mês passado
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
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between font-normal">
            <div>Operaçõoes</div> <PieChart className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+56</div>
          <p className="text-xs text-muted-foreground">
            +122.1% do mês passado
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
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
