// Skeleton for /packages page
function CardSkeleton() {
  return (
    <div className="bg-slate-900/80 rounded-[2.5rem] p-3 border border-slate-800 animate-pulse">
      <div className="h-64 rounded-[2rem] bg-slate-800" />
      <div className="px-5 py-6 space-y-4">
        <div className="h-5 bg-slate-800 rounded-full w-3/4" />
        <div className="h-4 bg-slate-800 rounded-full w-1/2" />
        <div className="h-4 bg-slate-800 rounded-full w-full" />
        <div className="h-4 bg-slate-800 rounded-full w-5/6" />
        <div className="h-14 bg-slate-800 rounded-[1.5rem] mt-2" />
      </div>
    </div>
  );
}

export default function PackagesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Filter bar skeleton */}
        <div className="flex gap-3 mb-12 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-28 bg-slate-800 rounded-full animate-pulse flex-shrink-0" />
          ))}
        </div>
        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
