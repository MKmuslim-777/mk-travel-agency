"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PackageForm, { EMPTY_FORM, buildPayload } from "@/components/PackageForm";

export default function AddPackagePage() {
  const router = useRouter();
  const [form, setForm]         = useState(EMPTY_FORM);
  const [images, setImages]     = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading]   = useState(false);

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
      router.push("/dashboard/manage-packages");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <div className="mb-8">
        <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">Packages</span>
        <h1 className="text-4xl font-black text-white tracking-tighter mt-1">Add Package</h1>
      </div>
      <PackageForm
        form={form} setForm={setForm}
        images={images} setImages={setImages}
        uploading={uploading} setUploading={setUploading}
        loading={loading}
        onSubmit={handleSubmit}
        submitLabel="Add Package →"
      />
    </div>
  );
}
