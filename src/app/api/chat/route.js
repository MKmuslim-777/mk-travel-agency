import { connect } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

// GET — messages for a room (or all rooms for admin/mod)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    const listRooms = searchParams.get("listRooms");

    const col = await connect("chat_messages");

    if (listRooms) {
      // Admin/mod: get all unique rooms with last message
      const session = await auth();
      if (!["admin", "moderator"].includes(session?.user?.role)) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      // Aggregate: group by roomId, get last message + user info
      const rooms = await col.aggregate([
        { $sort: { createdAt: 1 } },
        {
          $group: {
            _id:         "$roomId",
            lastMessage: { $last: "$text" },
            lastAt:      { $last: "$createdAt" },
            userName:    { $first: "$senderName" },
            userId:      { $first: "$senderId" },
            msgCount:    { $sum: 1 },
          },
        },
        { $sort: { lastAt: -1 } },
      ]).toArray();
      return Response.json(rooms.map((r) => ({ ...r, id: r._id })));
    }

    if (!roomId) return Response.json({ error: "roomId required" }, { status: 400 });

    const messages = await col
      .find({ roomId })
      .sort({ createdAt: 1 })
      .toArray();

    return Response.json(
      messages.map((m) => ({ ...m, _id: m._id.toString() }))
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// POST — send a message
export async function POST(request) {
  try {
    const body = await request.json();
    const { roomId, text, senderId, senderName, senderImage, role } = body;

    if (!roomId || !text?.trim() || !senderId) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const col = await connect("chat_messages");
    const msg = {
      roomId,
      text:        text.trim(),
      senderId,
      senderName:  senderName  || "Guest",
      senderImage: senderImage || null,
      role:        role        || "user",
      createdAt:   new Date(),
    };
    const result = await col.insertOne(msg);
    return Response.json({ ...msg, _id: result.insertedId.toString() }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}


// DELETE — delete all messages in a room (admin only)
export async function DELETE(request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    if (!roomId) return Response.json({ error: "roomId required" }, { status: 400 });

    const col = await connect("chat_messages");
    await col.deleteMany({ roomId });
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
