export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-slate-950 pt-40 pb-24 px-4 animate-pulse">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* Info side */}
        <div className="space-y-6">
          <div className="h-12 w-3/4 bg-slate-800 rounded-2xl" />
          <div className="h-5 w-full bg-slate-800 rounded-full" />
          <div className="h-5 w-5/6 bg-slate-800 rounded-full" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-800 rounded-[1.5rem]" />
          ))}
        </div>
        {/* Form side */}
        <div className="h-[500px] bg-slate-800 rounded-[2rem]" />
      </div>
    </div>
  );
}
