import Sidebar from "../Sidebar/Sidebar";
import LineChart from "./LineChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <Tabs defaultValue="diario" className="w-[400px] mb-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="diario">Diário</TabsTrigger>
            <TabsTrigger value="semanal">Semanal</TabsTrigger>
            <TabsTrigger value="mensal">Mensal</TabsTrigger>
            <TabsTrigger value="anual">Anual</TabsTrigger>
          </TabsList>
          <TabsContent value="diario"></TabsContent>
          <TabsContent value="semanal"></TabsContent>
          <TabsContent value="mensal"></TabsContent>
          <TabsContent value="anual"></TabsContent>
        </Tabs>
        <LineChart />
      </div>
    </div>
  );
}
