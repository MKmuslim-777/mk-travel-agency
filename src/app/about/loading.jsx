export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-slate-950 animate-pulse">
      {/* Hero */}
      <div className="pt-40 pb-24 px-4 text-center space-y-4 max-w-3xl mx-auto">
        <div className="h-6 w-32 bg-slate-800 rounded-full mx-auto" />
        <div className="h-16 w-3/4 bg-slate-800 rounded-2xl mx-auto" />
        <div className="h-5 w-2/3 bg-slate-800 rounded-full mx-auto" />
      </div>

      {/* Values grid */}
      <div className="max-w-7xl mx-auto px-4 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-slate-800 rounded-[2rem]" />
        ))}
      </div>
    </div>
  );
}
