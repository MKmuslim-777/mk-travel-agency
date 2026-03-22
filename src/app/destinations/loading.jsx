export default function DestinationsLoading() {
  return (
    <div className="min-h-screen bg-slate-950 pt-40 pb-32 px-4">
      {/* Hero skeleton */}
      <div className="max-w-4xl mx-auto text-center mb-20 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded-full mx-auto" />
        <div className="h-16 w-3/4 bg-slate-800 rounded-2xl mx-auto" />
        <div className="h-6 w-2/3 bg-slate-800 rounded-full mx-auto" />
      </div>

      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="grid lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border border-slate-800 animate-pulse"
          >
            <div className="h-72 lg:h-80 bg-slate-800" />
            <div className="bg-slate-900 p-12 space-y-4">
              <div className="h-4 w-24 bg-slate-800 rounded-full" />
              <div className="h-12 w-48 bg-slate-800 rounded-2xl" />
              <div className="h-4 w-full bg-slate-800 rounded-full" />
              <div className="h-4 w-5/6 bg-slate-800 rounded-full" />
              <div className="h-4 w-4/6 bg-slate-800 rounded-full" />
              <div className="flex gap-2 pt-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-8 w-20 bg-slate-800 rounded-full" />
                ))}
              </div>
              <div className="h-14 w-40 bg-slate-800 rounded-2xl mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
