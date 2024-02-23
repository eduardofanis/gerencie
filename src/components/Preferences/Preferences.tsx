import Sidebar from "../Sidebar/Sidebar";

export default function Preferences() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Preferências</h1>
        <div className="grid grid-cols-3"></div>
      </div>
    </div>
  );
}
