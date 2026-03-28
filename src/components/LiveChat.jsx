"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { MdSupportAgent, MdClose, MdSend, MdChat } from "react-icons/md";

function getGuestId() {
  if (typeof window === "undefined") return "guest_ssr";
  let id = localStorage.getItem("mk_chat_guest_id");
  if (!id) {
    id = "guest_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("mk_chat_guest_id", id);
  }
  return id;
}

function getRoomId() {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem("mk_chat_room_id");
  if (!id) {
    id = "room_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    localStorage.setItem("mk_chat_room_id", id);
  }
  return id;
}

export default function LiveChat() {
  const { data: session } = useSession();
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState("");
  const [guestName, setGuestName] = useState("");
  const [nameSet, setNameSet]     = useState(false);
  const [sending, setSending]     = useState(false);
  const [unread, setUnread]       = useState(0);
  const bottomRef  = useRef(null);
  const pollRef    = useRef(null);
  const lastCount  = useRef(0);

  const isStaff  = ["admin", "moderator"].includes(session?.user?.role);
  const senderId = session?.user?.id || getGuestId();
  const senderName = session?.user?.name || guestName || "Guest";
  const roomId   = getRoomId();

  // Poll messages when chat is open
  useEffect(() => {
    if (!open || !nameSet && !session) return;

    async function fetchMessages() {
      try {
        const res = await fetch(`/api/chat?roomId=${roomId}`);
        if (!res.ok) return;
        const data = await res.json();
        setMessages(data);
        // Count new support messages when chat is closed
        if (!open) {
          const supportMsgs = data.filter(
            (m) => (m.role === "admin" || m.role === "moderator") && m._id > (lastCount.current || "")
          );
          if (supportMsgs.length > 0) setUnread((p) => p + supportMsgs.length);
        }
        lastCount.current = data.length;
      } catch {}
    }

    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 2000);
    return () => clearInterval(pollRef.current);
  }, [open, nameSet, session, roomId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear unread on open
  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          text:       text.trim(),
          senderId,
          senderName,
          role:       session?.user?.role || "user",
        }),
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

  // Don't render for admin/mod
  if (isStaff) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[500] w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.5)] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Live Chat"
      >
        {open ? <MdClose size={24} /> : <MdChat size={24} />}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white text-[10px] font-black flex items-center justify-center">
            {unread}
          </span>
        )}
        {unread === 0 && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-300 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[499] w-[340px] sm:w-[380px] bg-slate-900 border border-slate-700 rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          style={{ height: "480px" }}
        >
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
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <MdClose size={20} />
            </button>
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
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your name..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
                <button type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl transition-all">
                  Start Chat
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <MdSupportAgent className="text-4xl text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm font-bold">আমাদের সাথে chat করুন!</p>
                    <p className="text-slate-600 text-xs mt-1">আমরা সাধারণত কয়েক মিনিটের মধ্যে reply করি।</p>
                  </div>
                )}
                {messages.map((msg) => {
                  const isSupport = msg.role === "admin" || msg.role === "moderator";
                  return (
                    <div key={msg._id} className={`flex ${isSupport ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[78%] px-4 py-2.5 rounded-xl text-sm font-bold ${
                        isSupport
                          ? "bg-slate-800 text-slate-200 rounded-tl-sm"
                          : "bg-emerald-500 text-white rounded-tr-sm"
                      }`}>
                        {isSupport && (
                          <p className="text-[10px] font-black text-emerald-400 mb-1 uppercase tracking-widest">
                            Support
                          </p>
                        )}
                        <p className="leading-relaxed">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${isSupport ? "text-slate-500" : "text-emerald-200"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-3 border-t border-slate-800 flex gap-2 shrink-0">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Message লিখুন..."
                  className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-2xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                />
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
      )}
    </>
  );
}
