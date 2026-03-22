export default function PackageDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-950 animate-pulse">
      {/* Hero image skeleton */}
      <div className="h-[60vh] bg-slate-800" />

      <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-10 w-3/4 bg-slate-800 rounded-2xl" />
          <div className="h-5 w-1/2 bg-slate-800 rounded-full" />
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full bg-slate-800 rounded-full" />
            <div className="h-4 w-5/6 bg-slate-800 rounded-full" />
            <div className="h-4 w-4/6 bg-slate-800 rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-800 rounded-[1.5rem]" />
            ))}
          </div>
        </div>
        {/* Sidebar */}
        <div className="h-96 bg-slate-800 rounded-[2rem]" />
      </div>
    </div>
  );
}
