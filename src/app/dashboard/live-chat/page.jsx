"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { ref, set, remove, onValue, off } from "firebase/database";
import { db } from "@/lib/firebase";
import { MdSupportAgent, MdSend, MdPerson, MdCircle, MdDelete } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

// Animated typing dots
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-slate-700 rounded-xl rounded-tl-sm w-fit">
      {[0,1,2].map((i) => (
        <span key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }} />
      ))}
    </div>
  );
}

// Avatar bubble
function Avatar({ name, image }) {
  return (
    <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/20 overflow-hidden flex items-center justify-center text-emerald-400 font-black text-xs shrink-0">
      {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

export default function LiveChatAdminPage() {
  const { data: session, status } = useSession();
  const [rooms, setRooms]           = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages]     = useState([]);
  const [text, setText]             = useState("");
  const [sending, setSending]       = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [roomSearch, setRoomSearch] = useState("");
  const [userTyping, setUserTyping] = useState(null); // {name, image} of typing user
  const bottomRef   = useRef(null);
  const roomPollRef = useRef(null);
  const msgPollRef  = useRef(null);
  const typingTimer = useRef(null);

  const isStaff = ["admin", "moderator"].includes(session?.user?.role);

  // Poll room list
  useEffect(() => {
    if (!isStaff) return;
    async function fetchRooms() {
      try {
        const res = await fetch("/api/chat?listRooms=1");
        if (!res.ok) return;
        setRooms(await res.json());
      } catch {}
    }
    fetchRooms();
    roomPollRef.current = setInterval(fetchRooms, 3000);
    return () => clearInterval(roomPollRef.current);
  }, [isStaff]);

  // Poll messages for active room
  useEffect(() => {
    clearInterval(msgPollRef.current);
    if (!activeRoom) return;
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/chat?roomId=${activeRoom}`);
        if (!res.ok) return;
        setMessages(await res.json());
      } catch {}
    }
    fetchMessages();
    msgPollRef.current = setInterval(fetchMessages, 2000);
    return () => clearInterval(msgPollRef.current);
  }, [activeRoom]);

  // Listen to typing status for active room via Firebase
  useEffect(() => {
    if (!activeRoom || !session) return;
    const typingRef = ref(db, `typing/${activeRoom}`);
    onValue(typingRef, (snap) => {
      const data = snap.val() || {};
      // Find a non-support user typing
      const typingUser = Object.entries(data).find(
        ([uid, info]) => uid !== session.user.id && info.role === "user" && Date.now() - (info.ts || 0) < 4000
      );
      setUserTyping(typingUser ? typingUser[1] : null);
    });
    return () => off(typingRef);
  }, [activeRoom, session]);

  // Auto scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, userTyping]);

  // Broadcast admin typing to Firebase
  function handleTextChange(e) {
    setText(e.target.value);
    if (!activeRoom || !session) return;
    const typingRef = ref(db, `typing/${activeRoom}/${session.user.id}`);
    set(typingRef, { name: session.user.name, image: session.user.image || null, role: session.user.role, ts: Date.now() });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => remove(typingRef), 3000);
  }

  async function deleteRoom(roomId) {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-bold text-sm">এই conversation মুছে ফেলবেন?</p>
        <p className="text-xs text-gray-500">সব messages permanently delete হবে।</p>
        <div className="flex gap-2">
          <button onClick={async () => {
            toast.dismiss(t.id); setDeleting(true);
            try {
              const res = await fetch(`/api/chat?roomId=${roomId}`, { method: "DELETE" });
              if (!res.ok) throw new Error();
              setRooms((p) => p.filter((r) => r.id !== roomId));
              if (activeRoom === roomId) { setActiveRoom(null); setMessages([]); }
              toast.success("Conversation মুছে ফেলা হয়েছে।");
            } catch { toast.error("Delete failed."); }
            finally { setDeleting(false); }
          }} className="flex-1 py-2 bg-rose-500 hover:bg-rose-400 text-white text-xs font-black rounded-xl">হ্যাঁ, মুছুন</button>
          <button onClick={() => toast.dismiss(t.id)} className="flex-1 py-2 bg-slate-200 text-slate-700 text-xs font-black rounded-xl">বাতিল</button>
        </div>
      </div>
    ), { duration: 10000 });
  }

  async function sendReply(e) {
    e.preventDefault();
    if (!text.trim() || !activeRoom || sending) return;
    // Clear typing on send
    if (session) remove(ref(db, `typing/${activeRoom}/${session.user.id}`));
    clearTimeout(typingTimer.current);
    setSending(true);
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId:      activeRoom,
          text:        text.trim(),
          senderId:    session.user.id,
          senderName:  session.user.name,
          senderImage: session.user.image || null,
          role:        session.user.role,
        }),
      });
      setText("");
    } catch {}
    finally { setSending(false); }
  }

  if (status === "loading") return <div className="p-10 flex items-center justify-center min-h-[60vh]"><span className="loading loading-spinner loading-lg text-emerald-400" /></div>;
  if (!isStaff) return <div className="p-10 text-center text-slate-400 font-bold">Access denied.</div>;

  const activeRoomData = rooms.find((r) => r.id === activeRoom);

  return (
    <div className="p-4 md:p-6 flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
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
              <input value={roomSearch} onChange={(e) => setRoomSearch(e.target.value)} placeholder="Search..."
                className="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-600 rounded-xl pl-8 pr-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {rooms.filter((r) => !roomSearch || r.userName?.toLowerCase().includes(roomSearch.toLowerCase())).length === 0 ? (
              <div className="text-center py-12">
                <MdSupportAgent className="text-4xl text-slate-700 mx-auto mb-2" />
                <p className="text-slate-600 text-sm font-bold">No chats yet</p>
              </div>
            ) : rooms.filter((r) => !roomSearch || r.userName?.toLowerCase().includes(roomSearch.toLowerCase())).map((room) => (
              <div key={room.id} className={`group relative rounded-2xl transition-all ${activeRoom === room.id ? "bg-emerald-500/10 border border-emerald-500/20" : "hover:bg-slate-800/60"}`}>
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
                {session?.user?.role === "admin" && (
                  <button onClick={(e) => { e.stopPropagation(); deleteRoom(room.id); }} disabled={deleting}
                    className="absolute top-2 right-2 w-7 h-7 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
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
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm">
                  {activeRoomData?.userName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <p className="text-white font-black text-sm">{activeRoomData?.userName || "Guest"}</p>
                  <p className={`text-xs font-bold flex items-center gap-1 ${userTyping ? "text-amber-400" : "text-emerald-400"}`}>
                    <MdCircle size={8} />
                    {userTyping ? "typing..." : `Active · ${activeRoomData?.msgCount || 0} messages`}
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
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {messages.length === 0 && <div className="text-center py-8 text-slate-600 font-bold text-sm">No messages yet</div>}
                {messages.map((msg, idx) => {
                  const isSupport = msg.role === "admin" || msg.role === "moderator";
                  const nextMsg = messages[idx + 1];
                  const showAvatar = !nextMsg || nextMsg.senderId !== msg.senderId;

                  return (
                    <div key={msg._id} className={`flex items-end gap-2 ${isSupport ? "justify-end" : "justify-start"}`}>
                      {/* User avatar on left */}
                      {!isSupport && (
                        <div className="shrink-0 w-7">
                          {showAvatar && <Avatar name={msg.senderName} image={msg.senderImage} />}
                        </div>
                      )}

                      <div className={`max-w-[70%] flex flex-col ${isSupport ? "items-end" : "items-start"}`}>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm font-bold ${
                          isSupport
                            ? "bg-emerald-500 text-white rounded-tr-sm"
                            : "bg-slate-800 text-slate-200 rounded-tl-sm"
                        }`}>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                        {showAvatar && (
                          <p className={`text-[10px] mt-1 font-bold text-slate-600 ${isSupport ? "mr-1" : "ml-1"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>

                      {/* Support avatar on right */}
                      {isSupport && (
                        <div className="shrink-0 w-7">
                          {showAvatar && <Avatar name={msg.senderName} image={msg.senderImage} />}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* User typing indicator */}
                {userTyping && (
                  <div className="flex items-end gap-2 justify-start">
                    <div className="w-7 shrink-0">
                      <Avatar name={userTyping.name} image={userTyping.image} />
                    </div>
                    <TypingDots />
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Reply input */}
              <form onSubmit={sendReply} className="p-3 border-t border-slate-800 flex gap-2 shrink-0">
                <input value={text} onChange={handleTextChange} placeholder="Reply করুন..."
                  className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-2xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors" />
                <button type="submit" disabled={!text.trim() || sending}
                  className="w-10 h-10 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0">
                  {sending ? <span className="loading loading-spinner loading-xs" /> : <MdSend size={18} />}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
