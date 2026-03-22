import Link from "next/link";
import { MdFlight } from "react-icons/md";
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-5 group">
            <div className="w-11 h-11 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
              <MdFlight className="text-2xl text-emerald-400 rotate-45" />
            </div>
            <div className="leading-tight">
              <p className="font-black text-white text-base tracking-tighter">MK Travel</p>
              <p className="text-[10px] font-black text-emerald-500 tracking-[0.3em] uppercase">Agency</p>
            </div>
          </Link>
          <p className="text-sm text-slate-500 font-bold leading-relaxed mb-6">
            বাংলাদেশের সেরা ট্যুর অপারেটর। আপনার স্বপ্নের ভ্রমণ আমাদের সাথে পরিকল্পনা করুন।
          </p>
          <div className="flex gap-2">
            {[
              { icon: <FaFacebook />, href: "#" },
              { icon: <FaInstagram />, href: "#" },
              { icon: <FaYoutube />, href: "#" },
              { icon: <FaWhatsapp />, href: "#" },
            ].map((s, i) => (
              <a key={i} href={s.href}
                className="w-9 h-9 bg-slate-800 hover:bg-emerald-500/10 border border-slate-700 hover:border-emerald-500/30 rounded-xl flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-all text-sm">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-5">Quick Links</h3>
          <ul className="space-y-3">
            {[
              { href: "/", label: "Home" },
              { href: "/packages", label: "Packages" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
              { href: "/dashboard", label: "My Bookings" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-slate-500 font-bold hover:text-emerald-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Destinations */}
        <div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-5">Top Destinations</h3>
          <ul className="space-y-3">
            {["কক্সবাজার", "সুন্দরবন", "সিলেট", "বান্দরবান", "সেন্ট মার্টিন", "রাঙামাটি"].map((d) => (
              <li key={d}>
                <Link href={`/packages?destination=${d}`} className="text-sm text-slate-500 font-bold hover:text-emerald-400 transition-colors">
                  {d}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-5">Contact</h3>
          <ul className="space-y-4">
            {[
              { icon: <FaMapMarkerAlt className="text-emerald-500 shrink-0 mt-0.5" />, text: "১২৩, ট্রাভেল স্ট্রিট, ঢাকা ১০০০" },
              { icon: <FaPhone className="text-emerald-500 shrink-0" />, text: "+৮৮০ ১৭০০-০০০০০০" },
              { icon: <FaEnvelope className="text-emerald-500 shrink-0" />, text: "info@mktravelagency.com" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-500 font-bold">
                {item.icon} {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
            © {new Date().getFullYear()} MK Travel Agency. All Rights Reserved.
          </p>
          <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
            Made with ❤️ in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
