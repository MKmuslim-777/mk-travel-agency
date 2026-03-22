export default function RegisterLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex animate-pulse">
      {/* Left panel */}
      <div className="hidden lg:block lg:w-1/2 bg-slate-900" />
      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="h-16 w-16 bg-slate-800 rounded-3xl mx-auto" />
          <div className="h-10 w-56 bg-slate-800 rounded-2xl mx-auto" />
          <div className="h-14 bg-slate-800 rounded-2xl" />
          <div className="h-px bg-slate-800" />
          <div className="space-y-4">
            <div className="h-14 bg-slate-800 rounded-2xl" />
            <div className="h-14 bg-slate-800 rounded-2xl" />
            <div className="h-14 bg-slate-800 rounded-2xl" />
            <div className="h-14 bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
