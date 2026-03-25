import { connect } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

// GET — full user profile from DB
export async function GET() {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const col = await connect("users");
    const user = await col.findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { password: 0 } }
    );
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({ ...user, _id: user._id.toString() });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH — update profile fields + optional password change
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      name, image,
      phone, address, city, occupation, bio, dateOfBirth, gender,
      emergencyContact, emergencyPhone,
      currentPassword, newPassword,
    } = body;

    const col = await connect("users");
    const user = await col.findOne({ _id: new ObjectId(session.user.id) });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const update = {};

    // Basic info
    if (name?.trim())        update.name        = name.trim();
    if (image?.trim())       update.image       = image.trim();

    // Contact & personal info — allow empty string to clear fields
    if (phone       !== undefined) update.phone            = phone;
    if (address     !== undefined) update.address          = address;
    if (city        !== undefined) update.city             = city;
    if (occupation  !== undefined) update.occupation       = occupation;
    if (bio         !== undefined) update.bio              = bio;
    if (dateOfBirth !== undefined) update.dateOfBirth      = dateOfBirth;
    if (gender      !== undefined) update.gender           = gender;
    if (emergencyContact !== undefined) update.emergencyContact = emergencyContact;
    if (emergencyPhone   !== undefined) update.emergencyPhone   = emergencyPhone;

    // Password change
    if (newPassword) {
      if (!currentPassword) return Response.json({ error: "Current password required" }, { status: 400 });
      if (!user.password)   return Response.json({ error: "Cannot change password for OAuth accounts" }, { status: 400 });
      const valid = bcrypt.compareSync(currentPassword, user.password);
      if (!valid) return Response.json({ error: "Current password is incorrect" }, { status: 400 });
      if (newPassword.length < 6) return Response.json({ error: "New password must be at least 6 characters" }, { status: 400 });
      update.password = bcrypt.hashSync(newPassword, 10);
    }

    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await col.updateOne({ _id: new ObjectId(session.user.id) }, { $set: update });
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
