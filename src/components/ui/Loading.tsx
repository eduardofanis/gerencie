export default function Loading() {
  return (
    <div className="w-[50%] flex items-center gap-2 h-10">
      <div style={{ width: `16px`, height: `16px` }} className="animate-spin">
        <div
          className="h-full w-full border-2  border-slate-400 border-b-transparent
        rounded-[50%]"
        ></div>
      </div>
      <span className="font-medium text-slate-500">Carregando...</span>
    </div>
  );
}
