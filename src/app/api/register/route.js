import { connect } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ error: "সব তথ্য পূরণ করুন।" }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে।" }, { status: 400 });
    }

    const users = await connect("users");

    // Check duplicate email
    const existing = await users.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return Response.json({ error: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে।" }, { status: 409 });
    }

    // Hash password and save
    const hashed = bcrypt.hashSync(password, 10);
    await users.insertOne({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role: "user",
      createdAt: new Date(),
    });

    return Response.json({ message: "অ্যাকাউন্ট তৈরি হয়েছে।" }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return Response.json({ error: "সার্ভার সমস্যা হয়েছে।" }, { status: 500 });
  }
}
