export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-400 animate-spin" />
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Loading...</p>
      </div>
    </div>
  );
}
