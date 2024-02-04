import Sidebar from "../Sidebar/Sidebar";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      </div>
    </div>
  );
}
