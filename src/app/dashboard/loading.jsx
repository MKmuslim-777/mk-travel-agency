export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 animate-pulse">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 space-y-3">
          <div className="h-10 w-64 bg-slate-800 rounded-2xl" />
          <div className="h-5 w-48 bg-slate-800 rounded-full" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-800 rounded-[1.5rem]" />
          ))}
        </div>

        {/* Booking cards */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-800 rounded-[1.5rem]" />
          ))}
        </div>
      </div>
    </div>
  );
}
