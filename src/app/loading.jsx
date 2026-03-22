// Global loading skeleton — shown while any page segment is streaming
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated plane */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-ping" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-emerald-400 rotate-45 animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
            </svg>
          </div>
        </div>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest animate-pulse">
          লোড হচ্ছে...
        </p>
      </div>
    </div>
  );
}
