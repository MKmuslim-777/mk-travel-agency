"use client";
import { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
  FaPaperPlane,
  FaCheckCircle,
  FaArrowRight,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { MdSupportAgent, MdLocationOn } from "react-icons/md";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    // 'dark' class can be toggled at a higher level (like layout or body)
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-500">
      {/* ── Hero Section ── */}
      <section className="relative h-[400px] md:h-[450px] flex items-center justify-center overflow-hidden bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        />
        {/* Gradient Overlay for smooth transition to content */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] dark:from-slate-950 via-transparent to-transparent" />

        <div className="relative z-10 text-center px-4">
          <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 backdrop-blur-md border border-emerald-500/30">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            Contact{" "}
            <span className="text-emerald-400 underline decoration-emerald-500/30">
              Us
            </span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            আপনার স্বপ্নীল ভ্রমণের পরিকল্পনা শুরু হোক আমাদের একটি আলোচনার
            মাধ্যমে। We're here to help you 24/7.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="relative -mt-20 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Info & Socials */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 tracking-tight">
                  Office Info
                </h3>

                <div className="space-y-7">
                  <ContactItem
                    icon={<FaPhone className="text-emerald-500" />}
                    label="Phone"
                    value="+880 1XXX-XXXXXX"
                    sub="Available 9am - 9pm"
                  />
                  <ContactItem
                    icon={<FaWhatsapp className="text-green-500" />}
                    label="WhatsApp"
                    value="+880 1XXX-XXXXXX"
                    sub="Instant Chat"
                  />
                  <ContactItem
                    icon={<FaEnvelope className="text-blue-500" />}
                    label="Email"
                    value="info@mktravel.com"
                    sub="Support within 24h"
                  />
                  <ContactItem
                    icon={<MdLocationOn className="text-rose-500 text-xl" />}
                    label="Location"
                    value="Dhaka, Bangladesh"
                    sub="Main Corporate Office"
                  />
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
                    Social Presence
                  </p>
                  <div className="flex gap-4">
                    {[FaFacebookF, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      >
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-emerald-600 dark:bg-emerald-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <MdSupportAgent className="absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-700" />
                <h4 className="text-xl font-black mb-2 tracking-tight">
                  Customer Support
                </h4>
                <p className="text-emerald-100 text-sm font-medium leading-relaxed mb-6">
                  আমাদের দক্ষ প্রতিনিধি দল আপনার যে কোনো সমস্যায় তাৎক্ষণিক
                  সমাধান দিতে প্রস্তুত।
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />{" "}
                  Live Now
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-8">
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-14 transition-all">
                {sent ? (
                  <SuccessState onReset={() => setSent(false)} />
                ) : (
                  <>
                    <div className="mb-12">
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
                        Send us a message
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">
                        নিচের ফরমটি পূরণ করুন, আমরা দ্রুত যোগাযোগ করবো।
                      </p>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="grid grid-cols-1 md:grid-cols-2 gap-7"
                    >
                      <CustomInput
                        label="Full Name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(val) => setForm({ ...form, name: val })}
                      />
                      <CustomInput
                        label="Phone Number"
                        placeholder="017XXXXXXXX"
                        value={form.phone}
                        onChange={(val) => setForm({ ...form, phone: val })}
                      />

                      <div className="md:col-span-2">
                        <CustomInput
                          label="Email (Optional)"
                          placeholder="example@mail.com"
                          type="email"
                          value={form.email}
                          onChange={(val) => setForm({ ...form, email: val })}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">
                          Subject
                        </label>
                        <select
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-slate-950 focus:border-emerald-500 focus:outline-none transition-all appearance-none text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
                          value={form.subject}
                          onChange={(e) =>
                            setForm({ ...form, subject: e.target.value })
                          }
                          required
                        >
                          <option value="">Choose a topic</option>
                          <option value="package">Tour Package Inquiry</option>
                          <option value="booking">Booking Assistance</option>
                          <option value="custom">Custom Tour Plan</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">
                          Your Message
                        </label>
                        <textarea
                          rows={4}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl px-6 py-5 focus:bg-white dark:focus:bg-slate-950 focus:border-emerald-500 focus:outline-none transition-all resize-none text-slate-700 dark:text-slate-200 font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600"
                          placeholder="How can we help you?"
                          value={form.message}
                          onChange={(e) =>
                            setForm({ ...form, message: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="md:col-span-2 pt-4">
                        <button
                          disabled={loading}
                          className="w-full bg-slate-900 dark:bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all duration-300 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group disabled:opacity-70"
                        >
                          {loading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              Send Message{" "}
                              <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Components with Dark Support ──

function ContactItem({ icon, label, value, sub }) {
  return (
    <div className="flex items-center gap-5 group cursor-pointer">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-500">
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 dark:text-slate-500 mb-1">
          {label}
        </p>
        <p className="text-slate-800 dark:text-slate-200 font-black leading-none mb-1 tracking-tight">
          {value}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          {sub}
        </p>
      </div>
    </div>
  );
}

function CustomInput({ label, placeholder, value, onChange, type = "text" }) {
  return (
    <div className="space-y-3">
      <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={type !== "email"}
        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-slate-950 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-700 dark:text-slate-200 font-bold shadow-sm"
      />
    </div>
  );
}

function SuccessState({ onReset }) {
  return (
    <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
      <div className="relative inline-block mb-10">
        <div className="absolute inset-0 bg-emerald-200 dark:bg-emerald-500 rounded-full animate-ping opacity-25" />
        <div className="relative w-28 h-28 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20">
          <FaCheckCircle size={56} className="text-emerald-500" />
        </div>
      </div>
      <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
        Message Received!
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-12 text-lg font-medium">
        ধন্যবাদ! আপনার বার্তাটি আমাদের কাছে পৌঁছেছে। দ্রুততম সময়ের মধ্যে আমরা
        যোগাযোগ করবো।
      </p>
      <button
        onClick={onReset}
        className="px-10 py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black hover:scale-105 transition-all shadow-xl"
      >
        Send Another Message
      </button>
    </div>
  );
}
