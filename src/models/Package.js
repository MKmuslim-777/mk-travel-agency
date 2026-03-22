import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    destination: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true }, // e.g. "7 Days / 6 Nights"
    image: { type: String, required: true },
    category: { type: String, enum: ["adventure", "beach", "cultural", "honeymoon", "family"], default: "beach" },
    rating: { type: Number, default: 4.5 },
    featured: { type: Boolean, default: false },
    includes: [String], // e.g. ["Hotel", "Flights", "Meals"]
  },
  { timestamps: true }
);

export default mongoose.models.Package || mongoose.model("Package", packageSchema);
