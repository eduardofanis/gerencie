import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import IncomeMonthChart from "./Cards/IncomeMonthChart";
import CostumersChart from "./Cards/CostumersChart";
import IncomeByPeriodChart from "./Cards/IncomeByPeriodChart";
import OperationsDayChart from "./Cards/OperationsDayChart";
import OperationsMonthChart from "./Cards/OperationsMonthChart";

export default function Dashboard() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <IncomeMonthChart />
        <OperationsMonthChart />
        <OperationsDayChart />
        <CostumersChart />
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 mt-4 gap-4">
        <IncomeByPeriodChart />
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
