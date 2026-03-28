"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { ref, set, remove, onValue, off } from "firebase/database";
import { db } from "@/lib/firebase";
import { MdSupportAgent, MdClose, MdSend, MdChat } from "react-icons/md";

function getGuestId() {
  if (typeof window === "undefined") return "guest_ssr";
  let id = localStorage.getItem("mk_chat_guest_id");
  if (!id) { id = "guest_" + Math.random().toString(36).slice(2, 10); localStorage.setItem("mk_chat_guest_id", id); }
  return id;
}
function getRoomId() {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem("mk_chat_room_id");
  if (!id) { id = "room_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8); localStorage.setItem("mk_chat_room_id", id); }
  return id;
}

// Animated typing dots
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-slate-800 rounded-xl rounded-tl-sm w-fit">
      {[0,1,2].map((i) => (
        <span key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }} />
      ))}
    </div>
  );
}

// Avatar bubble
function Avatar({ name, image, size = "sm" }) {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} rounded-full bg-emerald-500/20 border border-emerald-500/20 overflow-hidden flex items-center justify-center text-emerald-400 font-black shrink-0`}>
      {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

export default function LiveChat() {
  const { data: session } = useSession();
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState([]);
  const [text, setText]           = useState("");
  const [guestName, setGuestName] = useState("");
  const [nameSet, setNameSet]     = useState(false);
  const [sending, setSending]     = useState(false);
  const [unread, setUnread]       = useState(0);
  const [supportTyping, setSupportTyping] = useState(false); // support is typing
  const bottomRef   = useRef(null);
  const pollRef     = useRef(null);
  const lastCount   = useRef(0);
  const typingTimer = useRef(null);

  const isStaff    = ["admin", "moderator"].includes(session?.user?.role);
  const senderId   = session?.user?.id   || getGuestId();
  const senderName = session?.user?.name || guestName || "Guest";
  const senderImage = session?.user?.image || null;
  const roomId     = getRoomId();

  // Poll messages
  useEffect(() => {
    if (!open || (!nameSet && !session)) return;
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/chat?roomId=${roomId}`);
        if (!res.ok) return;
        const data = await res.json();
        setMessages(data);
        if (!open) {
          const newSupport = data.filter((m) => (m.role === "admin" || m.role === "moderator"));
          if (newSupport.length > lastCount.current) setUnread((p) => p + (newSupport.length - lastCount.current));
        }
        lastCount.current = data.length;
      } catch {}
    }
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 2000);
    return () => clearInterval(pollRef.current);
  }, [open, nameSet, session, roomId]);

  // Listen to support typing status via Firebase
  useEffect(() => {
    if (!roomId || (!nameSet && !session)) return;
    const typingRef = ref(db, `typing/${roomId}`);
    onValue(typingRef, (snap) => {
      const data = snap.val() || {};
      // Check if any support agent is typing (not the current user)
      const supportIsTyping = Object.entries(data).some(
        ([uid, info]) => uid !== senderId && (info.role === "admin" || info.role === "moderator") && Date.now() - (info.ts || 0) < 4000
      );
      setSupportTyping(supportIsTyping);
    });
    return () => off(typingRef);
  }, [roomId, nameSet, session, senderId]);

  // Auto scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, supportTyping]);
  useEffect(() => { if (open) setUnread(0); }, [open]);

  // Broadcast typing status to Firebase
  function handleTextChange(e) {
    setText(e.target.value);
    if (!roomId) return;
    const typingRef = ref(db, `typing/${roomId}/${senderId}`);
    set(typingRef, { name: senderName, image: senderImage, role: session?.user?.role || "user", ts: Date.now() });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => remove(typingRef), 3000);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    // Clear typing indicator immediately on send
    if (roomId) remove(ref(db, `typing/${roomId}/${senderId}`));
    clearTimeout(typingTimer.current);
    setSending(true);
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, text: text.trim(), senderId, senderName, senderImage, role: session?.user?.role || "user" }),
      });
      setText("");
    } catch {}
    finally { setSending(false); }
  }

  function handleNameSubmit(e) {
    e.preventDefault();
    if (!guestName.trim()) return;
    setNameSet(true);
  }

  const showChat = nameSet || !!session;
  if (isStaff) return null;

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[500] w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.5)] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Live Chat">
        {open ? <MdClose size={24} /> : <MdChat size={24} />}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white text-[10px] font-black flex items-center justify-center">{unread}</span>
        )}
        {unread === 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-300 rounded-full border-2 border-white animate-pulse" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[499] w-[340px] sm:w-[380px] bg-slate-900 border border-slate-700 rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          style={{ height: "480px" }}>
          {/* Header */}
          <div className="bg-emerald-600 px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MdSupportAgent size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-sm">Customer Support</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                <span className="text-emerald-100 text-xs font-bold">Live Now</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors"><MdClose size={20} /></button>
          </div>

          {/* Name prompt */}
          {!showChat ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <form onSubmit={handleNameSubmit} className="w-full space-y-4">
                <div className="text-center">
                  <MdSupportAgent className="text-4xl text-emerald-400 mx-auto mb-2" />
                  <p className="text-white font-black">আপনার নাম দিন</p>
                  <p className="text-slate-500 text-xs mt-1">Chat শুরু করতে নাম দিন</p>
                </div>
                <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Your name..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500" required />
                <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl transition-all">Start Chat</button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <MdSupportAgent className="text-4xl text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm font-bold">আমাদের সাথে chat করুন!</p>
                    <p className="text-slate-600 text-xs mt-1">আমরা সাধারণত কয়েক মিনিটের মধ্যে reply করি।</p>
                  </div>
                )}
                {messages.map((msg, idx) => {
                  const isSupport = msg.role === "admin" || msg.role === "moderator";
                  const isMe = msg.senderId === senderId;
                  // Show avatar only on last consecutive message from same sender
                  const nextMsg = messages[idx + 1];
                  const showAvatar = !nextMsg || nextMsg.senderId !== msg.senderId;

                  return (
                    <div key={msg._id} className={`flex items-end gap-2 ${isSupport ? "justify-start" : "justify-end"}`}>
                      {/* Support avatar on left */}
                      {isSupport && (
                        <div className="shrink-0 w-7">
                          {showAvatar && <Avatar name={msg.senderName} image={msg.senderImage} />}
                        </div>
                      )}

                      <div className={`max-w-[75%] flex flex-col ${isSupport ? "items-start" : "items-end"}`}>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm font-bold ${
                          isSupport
                            ? "bg-slate-800 text-slate-200 rounded-tl-sm"
                            : "bg-emerald-500 text-white rounded-tr-sm"
                        }`}>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                        {showAvatar && (
                          <p className={`text-[10px] mt-1 font-bold ${isSupport ? "text-slate-600 ml-1" : "text-slate-600 mr-1"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>

                      {/* User avatar on right */}
                      {!isSupport && (
                        <div className="shrink-0 w-7">
                          {showAvatar && <Avatar name={senderName} image={senderImage} />}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Support typing indicator */}
                {supportTyping && (
                  <div className="flex items-end gap-2 justify-start">
                    <div className="w-7 shrink-0">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-black">S</div>
                    </div>
                    <TypingDots />
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-3 border-t border-slate-800 flex gap-2 shrink-0">
                <input value={text} onChange={handleTextChange} placeholder="Message লিখুন..."
                  className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-2xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors" />
                <button type="submit" disabled={!text.trim() || sending}
                  className="w-10 h-10 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0">
                  {sending ? <span className="loading loading-spinner loading-xs" /> : <MdSend size={18} />}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
