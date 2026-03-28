"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import PackageForm, { EMPTY_FORM, buildPayload } from "@/components/PackageForm";

export default function AddPackageModal() {
  const router = useRouter();
  const [form, setForm]           = useState(EMPTY_FORM);
  const [images, setImages]       = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (images.length < 3) { toast.error("কমপক্ষে ৩টি ছবি দরকার।"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form, images)),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); return; }
      toast.success("প্যাকেজ যোগ করা হয়েছে!");
      setForm(EMPTY_FORM);
      setImages([]);
      document.getElementById("add-pkg-modal").close();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => document.getElementById("add-pkg-modal").showModal()}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5">
        <FaPlus className="text-xs" /> Add Package
      </button>

      <dialog id="add-pkg-modal" className="modal">
        <div className="modal-box max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-0 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
            <h3 className="text-xl font-black text-white tracking-tighter">Add New Package</h3>
            <button type="button" onClick={() => document.getElementById("add-pkg-modal").close()}
              className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 transition-colors">
              <MdClose size={18} />
            </button>
          </div>
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            <PackageForm
              form={form} setForm={setForm}
              images={images} setImages={setImages}
              uploading={uploading} setUploading={setUploading}
              loading={loading}
              onSubmit={handleSubmit}
              submitLabel="Add Package →"
            />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-slate-950/60 backdrop-blur-sm"><button>close</button></form>
      </dialog>
    </>
  );
}
