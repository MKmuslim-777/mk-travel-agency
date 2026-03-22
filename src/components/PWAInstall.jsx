"use client";

import { useEffect, useState } from "react";
import { FaDownload, FaTimes, FaMobileAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

export default function PWAInstall() {
  const [prompt, setPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
      setPrompt(null);
    }
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto md:left-auto md:right-8 md:translate-x-0 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="relative overflow-hidden bg-slate-900 border border-white/10 backdrop-blur-xl p-4 md:p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 md:min-w-[380px]">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[40px] -z-10" />

        {/* App Icon Mock */}
        <div className="relative flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <FaMobileAlt size={24} className="animate-pulse" />
          <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
            <MdVerified className="text-emerald-500 text-sm" />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
              Install App{" "}
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
            </h4>
            <button
              onClick={() => setShow(false)}
              className="text-slate-500 hover:text-white transition-colors p-1"
            >
              <FaTimes size={14} />
            </button>
          </div>
          <p className="text-[11px] md:text-xs text-slate-400 font-medium leading-relaxed">
            MK Travel Agency আপনার ফোনে ইনস্টল করুন।{" "}
            <br className="hidden md:block" />
            Enjoy <span className="text-emerald-400">Offline Access</span> &
            faster booking.
          </p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-grow py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <FaDownload className="text-[10px]" /> Install Now
            </button>
            <button
              onClick={() => setShow(false)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[11px] font-bold hover:bg-white/10 transition-all"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
