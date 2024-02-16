import Sidebar from "../Sidebar/Sidebar";
import { DataTable } from "./OperationsTable/data-table";
import { Operation, columns } from "./OperationsTable/columns";

const data: Operation[] = [
  {
    statusDaOperacao: 1,
    cliente: "Eduardo Fanis Lima",
    tipoDaOperacao: "FGTS",
    promotora: "Inove",
    dataDaOperacao: Date.now(),
    valorRecebido: 100,
    valorLiberado: 1000,
  },
  {
    statusDaOperacao: 1,
    cliente: "Eduardo Fanis Lima",
    tipoDaOperacao: "FGTS",
    promotora: "Inove",
    dataDaOperacao: Date.now(),
    valorRecebido: 100,
    valorLiberado: 1000,
  },
  {
    statusDaOperacao: 1,
    cliente: "Eduardo Fanis Lima",
    tipoDaOperacao: "FGTS",
    promotora: "Inove",
    dataDaOperacao: Date.now(),
    valorRecebido: 100,
    valorLiberado: 1000,
  },
  {
    statusDaOperacao: 1,
    cliente: "Eduardo Fanis Lima",
    tipoDaOperacao: "FGTS",
    promotora: "Inove",
    dataDaOperacao: Date.now(),
    valorRecebido: 100,
    valorLiberado: 1000,
  },
  {
    statusDaOperacao: 1,
    cliente: "Eduardo Fanis Lima",
    tipoDaOperacao: "FGTS",
    promotora: "Inove",
    dataDaOperacao: Date.now(),
    valorRecebido: 100,
    valorLiberado: 1000,
  },
  {
    statusDaOperacao: 1,
    cliente: "Eduardo Fanis Lima",
    tipoDaOperacao: "FGTS",
    promotora: "Inove",
    dataDaOperacao: Date.now(),
    valorRecebido: 100,
    valorLiberado: 1000,
  },
  {
    statusDaOperacao: 1,
    cliente: "Eduardo Fanis Lima",
    tipoDaOperacao: "FGTS",
    promotora: "Inove",
    dataDaOperacao: Date.now(),
    valorRecebido: 100,
    valorLiberado: 1000,
  },
  {
    statusDaOperacao: 1,
    cliente: "Eduardo Fanis Lima",
    tipoDaOperacao: "FGTS",
    promotora: "Inove",
    dataDaOperacao: Date.now(),
    valorRecebido: 100,
    valorLiberado: 1000,
  },
  {
    statusDaOperacao: 1,
    cliente: "Eduardo Fanis Lima",
    tipoDaOperacao: "FGTS",
    promotora: "Inove",
    dataDaOperacao: Date.now(),
    valorRecebido: 100,
    valorLiberado: 1000,
  },
  {
    statusDaOperacao: 1,
    cliente: "Eduardo Fanis Lima",
    tipoDaOperacao: "FGTS",
    promotora: "Inove",
    dataDaOperacao: Date.now(),
    valorRecebido: 100,
    valorLiberado: 1000,
  },
  {
    statusDaOperacao: 1,
    cliente: "Eduardo Fanis Lima",
    tipoDaOperacao: "FGTS",
    promotora: "Inove",
    dataDaOperacao: Date.now(),
    valorRecebido: 100,
    valorLiberado: 1000,
  },
];

export default function Operations() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-8 w-full h-screen">
        <h1 className="text-3xl font-bold mb-8">Operações</h1>

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
