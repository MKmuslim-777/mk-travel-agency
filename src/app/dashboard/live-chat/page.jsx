"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { MdSupportAgent, MdSend, MdPerson, MdCircle, MdDelete } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

export default function LiveChatAdminPage() {
  const { data: session, status } = useSession();
  const [rooms, setRooms]           = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages]     = useState([]);
  const [text, setText]             = useState("");
  const [sending, setSending]       = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const bottomRef   = useRef(null);
  const roomPollRef = useRef(null);
  const msgPollRef  = useRef(null);

  const isStaff = ["admin", "moderator"].includes(session?.user?.role);
  const [roomSearch, setRoomSearch] = useState("");

  // Poll room list every 3s
  useEffect(() => {
    if (!isStaff) return;

    async function fetchRooms() {
      try {
        const res = await fetch("/api/chat?listRooms=1");
        if (!res.ok) return;
        const data = await res.json();
        setRooms(data);
      } catch {}
    }

    fetchRooms();
    roomPollRef.current = setInterval(fetchRooms, 3000);
    return () => clearInterval(roomPollRef.current);
  }, [isStaff]);

  // Poll messages for active room every 2s
  useEffect(() => {
    clearInterval(msgPollRef.current);
    if (!activeRoom) return;

    async function fetchMessages() {
      try {
        const res = await fetch(`/api/chat?roomId=${activeRoom}`);
        if (!res.ok) return;
        const data = await res.json();
        setMessages(data);
      } catch {}
    }

    fetchMessages();
    msgPollRef.current = setInterval(fetchMessages, 2000);
    return () => clearInterval(msgPollRef.current);
  }, [activeRoom]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function deleteRoom(roomId) {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-bold text-sm">এই conversation মুছে ফেলবেন?</p>
        <p className="text-xs text-gray-500">সব messages permanently delete হবে।</p>
        <div className="flex gap-2">
          <button onClick={async () => {
            toast.dismiss(t.id);
            setDeleting(true);
            try {
              const res = await fetch(`/api/chat?roomId=${roomId}`, { method: "DELETE" });
              if (!res.ok) throw new Error();
              setRooms((p) => p.filter((r) => r.id !== roomId));
              if (activeRoom === roomId) { setActiveRoom(null); setMessages([]); }
              toast.success("Conversation মুছে ফেলা হয়েছে।");
            } catch { toast.error("Delete failed."); }
            finally { setDeleting(false); }
          }} className="flex-1 py-2 bg-rose-500 hover:bg-rose-400 text-white text-xs font-black rounded-xl">
            হ্যাঁ, মুছুন
          </button>
          <button onClick={() => toast.dismiss(t.id)}
            className="flex-1 py-2 bg-slate-200 text-slate-700 text-xs font-black rounded-xl">
            বাতিল
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  }

  async function sendReply(e) {
    e.preventDefault();
    if (!text.trim() || !activeRoom || sending) return;
    setSending(true);
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId:     activeRoom,
          text:       text.trim(),
          senderId:   session.user.id,
          senderName: session.user.name,
          role:       session.user.role,
        }),
      });
      setText("");
    } catch {}
    finally { setSending(false); }
  }

  if (status === "loading") return (
    <div className="p-10 flex items-center justify-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg text-emerald-400" />
    </div>
  );

  if (!isStaff) return (
    <div className="p-10 text-center text-slate-400 font-bold">Access denied.</div>
  );

  const activeRoomData = rooms.find((r) => r.id === activeRoom);

  return (
    <div className="p-4 md:p-6 flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
      {/* Header */}
      <div className="mb-4 shrink-0">
        <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">Support</span>
        <h1 className="text-2xl font-black text-white tracking-tighter mt-0.5">Live Chat</h1>
        <p className="text-slate-500 font-bold text-xs">{rooms.length} conversations</p>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Room list */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-800 shrink-0">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Conversations</p>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]" />
              <input value={roomSearch} onChange={(e) => setRoomSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-600 rounded-xl pl-8 pr-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {rooms.filter((r) => !roomSearch || r.userName?.toLowerCase().includes(roomSearch.toLowerCase())).length === 0 ? (
              <div className="text-center py-12">
                <MdSupportAgent className="text-4xl text-slate-700 mx-auto mb-2" />
                <p className="text-slate-600 text-sm font-bold">No chats yet</p>
                <p className="text-slate-700 text-xs mt-1">Waiting for customers...</p>
              </div>
            ) : rooms.filter((r) => !roomSearch || r.userName?.toLowerCase().includes(roomSearch.toLowerCase())).map((room) => (
              <div key={room.id} className={`group relative rounded-2xl transition-all ${
                activeRoom === room.id ? "bg-emerald-500/10 border border-emerald-500/20" : "hover:bg-slate-800/60"
              }`}>
                <button onClick={() => setActiveRoom(room.id)} className="w-full text-left p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm shrink-0">
                      {room.userName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-black text-sm truncate">{room.userName || "Guest"}</p>
                      <p className="text-slate-500 text-xs font-bold truncate">{room.lastMessage || "..."}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-[10px] text-slate-600 font-bold block">{room.msgCount} msgs</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mt-1" />
                    </div>
                  </div>
                </button>
                {/* Delete button — admin only */}
                {session?.user?.role === "admin" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteRoom(room.id); }}
                    disabled={deleting}
                    className="absolute top-2 right-2 w-7 h-7 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete conversation"
                  >
                    <MdDelete size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-[2rem] overflow-hidden flex flex-col">
          {!activeRoom ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MdSupportAgent className="text-6xl text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-bold">Select a conversation to reply</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-5 py-3.5 border-b border-slate-800 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
                  <MdPerson size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-black text-sm">{activeRoomData?.userName || "Guest"}</p>
                  <p className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <MdCircle size={8} /> Active · {activeRoomData?.msgCount || 0} messages
                  </p>
                </div>
                {session?.user?.role === "admin" && (
                  <button onClick={() => deleteRoom(activeRoom)} disabled={deleting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-black transition-all">
                    <MdDelete size={14} /> Delete
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-slate-600 font-bold text-sm">No messages yet</div>
                )}
                {messages.map((msg) => {
                  const isSupport = msg.role === "admin" || msg.role === "moderator";
                  return (
                    <div key={msg._id} className={`flex ${isSupport ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm font-bold ${
                        isSupport
                          ? "bg-emerald-500 text-white rounded-tr-sm"
                          : "bg-slate-800 text-slate-200 rounded-tl-sm"
                      }`}>
                        {!isSupport && (
                          <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">
                            {msg.senderName || "User"}
                          </p>
                        )}
                        <p className="leading-relaxed">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${isSupport ? "text-emerald-200" : "text-slate-500"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Reply input */}
              <form onSubmit={sendReply} className="p-3 border-t border-slate-800 flex gap-2 shrink-0">
                <input value={text} onChange={(e) => setText(e.target.value)}
                  placeholder="Reply করুন..."
                  className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-2xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors" />
                <button type="submit" disabled={!text.trim() || sending}
                  className="w-10 h-10 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0">
                  {sending
                    ? <span className="loading loading-spinner loading-xs" />
                    : <MdSend size={18} />
                  }
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
