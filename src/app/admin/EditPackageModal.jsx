"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import PackageForm, { formFromPkg, buildPayload } from "@/components/PackageForm";

export default function EditPackageModal({ pkg, onClose }) {
  const router = useRouter();
  const [form, setForm]           = useState(formFromPkg(pkg));
  const [images, setImages]       = useState(pkg.gallery?.length ? pkg.gallery : pkg.image ? [pkg.image] : []);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (images.length < 3) { toast.error("কমপক্ষে ৩টি ছবি দরকার।"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/packages/${pkg._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form, images)),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); return; }
      toast.success("প্যাকেজ আপডেট হয়েছে!");
      onClose();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)] z-10">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <h3 className="text-xl font-black text-white tracking-tighter">Edit Package</h3>
          <button type="button" onClick={onClose}
            className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 transition-colors">
            <MdClose size={18} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <PackageForm
            form={form} setForm={setForm}
            images={images} setImages={setImages}
            uploading={uploading} setUploading={setUploading}
            loading={loading}
            onSubmit={handleSubmit}
            submitLabel="Save Changes →"
          />
        </div>
      </div>
    </div>
  );
}
