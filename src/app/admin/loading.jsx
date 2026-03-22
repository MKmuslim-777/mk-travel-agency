export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-3">
            <div className="h-10 w-56 bg-slate-800 rounded-2xl" />
            <div className="h-5 w-40 bg-slate-800 rounded-full" />
          </div>
          <div className="h-12 w-40 bg-slate-800 rounded-2xl" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-800 rounded-[1.5rem]" />
          ))}
        </div>

        {/* Table */}
        <div className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden">
          <div className="h-16 bg-slate-800 border-b border-slate-700" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 border-b border-slate-800/50 px-6 flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-800 rounded-xl flex-shrink-0" />
              <div className="flex-1 h-4 bg-slate-800 rounded-full" />
              <div className="h-4 w-24 bg-slate-800 rounded-full" />
              <div className="h-4 w-20 bg-slate-800 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
