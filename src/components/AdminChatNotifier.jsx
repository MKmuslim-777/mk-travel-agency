"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MdChat } from "react-icons/md";

export default function AdminChatNotifier() {
  const { data: session } = useSession();
  const router = useRouter();
  const lastSeenRef  = useRef({}); // roomId → last message count
  const pollRef      = useRef(null);
  const mountedRef   = useRef(true);

  const isStaff = ["admin", "moderator"].includes(session?.user?.role);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!isStaff) return;

    async function checkNewMessages() {
      try {
        const res = await fetch("/api/chat?listRooms=1");
        if (!res.ok || !mountedRef.current) return;
        const rooms = await res.json();

        for (const room of rooms) {
          const prev = lastSeenRef.current[room.id];
          const curr = room.msgCount || 0;

          if (prev === undefined) {
            // First load — just record, don't notify
            lastSeenRef.current[room.id] = curr;
            continue;
          }

          if (curr > prev) {
            // New message arrived
            lastSeenRef.current[room.id] = curr;
            const senderName = room.userName || "Guest";

            toast(
              (t) => (
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    router.push("/dashboard/live-chat");
                  }}
                  className="flex items-center gap-3 text-left w-full"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                    {senderName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-900 text-sm truncate">{senderName}</p>
                    <p className="text-slate-500 text-xs font-bold truncate">{room.lastMessage || "New message"}</p>
                  </div>
                  <div className="shrink-0 ml-2">
                    <MdChat className="text-emerald-500 text-lg" />
                  </div>
                </button>
              ),
              {
                duration: 6000,
                style: {
                  background: "#f8fafc",
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  borderRadius: "1rem",
                  padding: "12px 16px",
                  cursor: "pointer",
                  maxWidth: "320px",
                },
                icon: null,
              }
            );
          }
        }
      } catch {}
    }

    // Start polling every 5s
    pollRef.current = setInterval(checkNewMessages, 5000);
    checkNewMessages(); // initial load to set baseline

    return () => clearInterval(pollRef.current);
  }, [isStaff, router]);

  return null; // renders nothing
}
