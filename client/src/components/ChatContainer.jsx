import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = () => {
  const { messages, sendMessage, selectedUser, setSelectedUser } = useContext(ChatContext);
  const { userData } = useContext(AuthContext);
  const [text, setText] = useState("");
  const scrollEnd = useRef();

  // Auto-scroll to bottom whenever messages array changes
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await sendMessage({
      text: text.trim(),
    });
    setText(""); // Clear input after sending
  };

  return selectedUser ? (
    <div className="h-full flex flex-col relative backdrop-blur-lg">
      {/* ------- header ------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500 shrink-0">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-lg text-white flex items-center gap-2">
            {selectedUser.fullName}
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          </p>
          <p className="text-xs text-gray-400">Online</p>
        </div>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="help" className="max-md:hidden max-w-5 opacity-70" />
      </div>

      {/* ------- chat Area ------- */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {messages && messages.map((msg, index) => {
          const isMe = msg.senderId === userData?._id; // Dynamic sender check
          return (
            <div
              key={msg._id || index}
              className={`flex items-end gap-2 ${isMe ? "flex-row justify-end" : "flex-row-reverse justify-end"}`}
            >
              <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="attachment"
                    className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-1"
                  />
                ) : (
                  <p
                    className={`p-3 max-w-[250px] text-sm font-light rounded-2xl break-words text-white ${
                      isMe
                        ? "bg-violet-600 rounded-br-none"
                        : "bg-[#282142] rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
                <p className="text-[10px] text-gray-500 mt-1">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
              <img
                src={isMe ? (userData?.profilePic || assets.avatar_icon) : (selectedUser?.profilePic || assets.avatar_icon)}
                alt="avatar"
                className="w-7 h-7 rounded-full object-cover border border-gray-700"
              />
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* ----------- Bottom input area -------- */}
      <form onSubmit={handleSendMessage} className="p-3 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-[#282142] px-4 rounded-full border border-gray-700">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 text-sm py-3 bg-transparent border-none outline-none text-white placeholder-gray-400"
            />
            <input type="file" id="image" accept="image/*" hidden />
            <label htmlFor="image">
              <img
                src={assets.gallery_icon}
                alt="gallery"
                className="w-5 mr-2 cursor-pointer opacity-70 hover:opacity-100"
              />
            </label>
          </div>
          <button type="submit" disabled={!text.trim()} className="disabled:opacity-50">
            <img src={assets.send_button} alt="send" className="w-9 cursor-pointer" />
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div className="flex flex-col h-full items-center justify-center gap-2 text-green-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="logo" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;