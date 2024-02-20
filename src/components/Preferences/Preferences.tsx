import Sidebar from "../Sidebar/Sidebar";
import Loading from "../ui/Loading";

export default function Preferences() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Preferências</h1>
          <Loading />
      </div>
    </div>
  );
}
