import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import Navbar from "./Navbar";
import { axiosInstance } from "../utils/axiosInstance.jsx";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
      },
    ]);

    setInput("");
    setLoading(true);

    const res = await axiosInstance.post("/agent/chat",{message:text});
    const data = res.data
    console.log(data)

     setMessages(prev=>[
     ...prev,
     {
          role:"assistant",
          content:data.reply
     }
     ]);

     setLoading(false);
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      {/* Header */}
      <Navbar className='bg-white' />
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-lg font-semibold">
          Your Assistant
        </h1>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-100"
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-zinc-800 px-4 py-3 text-zinc-400">
                AI is typing...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 bg-zinc-950 p-4">
        <div className="mx-auto flex max-w-3xl items-end gap-3 rounded-xl border border-zinc-700 bg-zinc-900 p-2">
          <textarea
            rows={1}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 outline-none"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-lg bg-blue-600 p-3 hover:bg-blue-700 disabled:opacity-50"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}