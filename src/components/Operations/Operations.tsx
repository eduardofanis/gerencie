import Sidebar from "../Sidebar/Sidebar";
import { DataTable } from "./OperationsTable/data-table";
import { Customer, columns } from "./OperationsTable/columns";

const data: Customer[] = [
  {
    id: "001",
    name: "Eduardo Fanis Lima",
    status: 1,
    type: "FGTS",
    amount: 1000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 2,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 3,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
  },
  {
    id: "002",
    name: "Caasd",
    status: 4,
    type: "GOV",
    amount: 2000,
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
