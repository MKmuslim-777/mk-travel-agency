import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us | MK Travel Agency",
  description: "MK Travel Agency এর সাথে যোগাযোগ করুন। ট্যুর প্যাকেজ বুকিং, কাস্টম ট্যুর প্ল্যান বা যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন।",
  alternates: { canonical: "https://mk-travel-agency.vercel.app/contact" },
  openGraph: {
    title: "Contact MK Travel Agency",
    description: "ট্যুর প্যাকেজ বুকিং বা যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন।",
    url: "https://mk-travel-agency.vercel.app/contact",
  },
};

async function getSettings() {
  try {
    const res = await fetch("https://mk-travel-agency.vercel.app/api/settings", { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-500">
      {/* Hero */}
      <section className="relative h-[400px] md:h-[450px] flex items-center justify-center overflow-hidden bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop"
          alt="Contact MK Travel Agency"
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] dark:from-slate-950 via-transparent to-transparent" />
        <div className="relative z-10 text-center px-4">
          <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 backdrop-blur-md border border-emerald-500/30">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            Contact <span className="text-emerald-400 underline decoration-emerald-500/30">Us</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            আপনার স্বপ্নীল ভ্রমণের পরিকল্পনা শুরু হোক আমাদের একটি আলোচনার মাধ্যমে। We&apos;re here to help you 24/7.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="relative -mt-20 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <ContactForm settings={settings} />
        </div>
      </section>
    </div>
  );
}
