import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    destination: { type: String, required: true },
    division:    { type: String, default: "" },
    price:       { type: Number, required: true },
    oldPrice:    { type: Number },
    duration:    { type: String, required: true }, // "৩ দিন / ২ রাত"
    image:       { type: String, required: true },
    gallery:     [String], // extra images
    category:    { type: String, enum: ["adventure", "beach", "cultural", "honeymoon", "family"], default: "beach" },
    rating:      { type: Number, default: 4.5 },
    featured:    { type: Boolean, default: false },
    isFlashDeal: { type: Boolean, default: false },
    maxGroupSize:{ type: Number, default: 15 },
    includes:    [String], // ["হোটেল", "পরিবহন", "গাইড"]
    excludes:    [String], // ["বিমান টিকিট", "ব্যক্তিগত খরচ"]
    highlights:  [String], // ["সূর্যাস্ত দেখা", "নৌকা ভ্রমণ"]
    itinerary: [
      {
        day:         { type: Number },
        title:       { type: String },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Package || mongoose.model("Package", packageSchema);
