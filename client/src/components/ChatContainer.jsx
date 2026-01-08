import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, sendMessage, selectedUser, setSelectedUser, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const scrollEnd = useRef();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!input.trim()) {
      toast.error("Type something to send ..");
      return;
    }
    await sendMessage({
      text: input.trim(),
    });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an valid image file!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  return selectedUser ? (
    <div className="h-full flex flex-col relative bg-transparent backdrop-blur-sm transition-all duration-300">
      {/* -------- Responsive Header --------- */}
      <div className="flex items-center gap-3 md:gap-4 py-3 md:py-4 px-4 md:px-6 border-b border-white/5 bg-black/10 backdrop-blur-md">
        
        {/* Mobile Back Button - Very important for responsiveness */}
        <div 
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
        >
          <img src={assets.arrow_icon} alt="back" className="w-5 invert opacity-70 rotate-180" />
        </div>

        <div className="relative shrink-0">
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            className="w-9 h-9 md:w-10 md:h-10 rounded-2xl object-cover border border-white/10"
            alt=""
          />
          {onlineUsers.includes(selectedUser._id) && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-500 border-[2px] md:border-[3px] border-[#020617] rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white tracking-tight leading-none truncate">
            {selectedUser.fullName}
          </p>
          <p className="text-[9px] md:text-[10px] text-indigo-400 mt-1 uppercase tracking-widest font-bold">
            {onlineUsers.includes(selectedUser._id) ? "Active in Orbit" : "Inactive"}
          </p>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <img src={assets.help_icon} alt="" className="max-md:hidden w-5 opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
          {/* Menu icon can be added here for mobile extra options if needed */}
        </div>
      </div>

      {/* -------- Chat Area (Messages) ---------  */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar">
        {messages &&
          messages.map((msg, index) => {
            if (!msg) return null;
            const isMe = msg.senderId === authUser._id;

            return (
              <div
                key={msg._id || index}
                className={`flex gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  isMe ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <img
                  src={isMe ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-7 h-7 md:w-8 md:h-8 rounded-xl object-cover border border-white/5 mt-auto shrink-0"
                />

                <div className={`flex flex-col max-w-[85%] md:max-w-[70%] lg:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
                  {msg.image ? (
                    <div className="relative group">
                       <img
                        src={msg.image}
                        alt="attachment"
                        className="rounded-2xl border border-white/10 shadow-lg max-w-full"
                      />
                    </div>
                  ) : (
                    <div
                      className={`px-3 md:px-4 py-2 md:py-2.5 shadow-xl text-[13px] md:text-[14px] leading-relaxed ${
                        isMe
                          ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-none"
                          : "bg-white/5 border border-white/10 text-gray-200 rounded-2xl rounded-bl-none backdrop-blur-md"
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}
                  <p className="text-[8px] md:text-[9px] text-gray-500 mt-1 font-medium tracking-tighter">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        <div ref={scrollEnd}></div>
      </div>

      {/* ----------- Bottom Area (Responsive Input) ------- */}
      <div className="p-3 md:p-6 bg-gradient-to-t from-black/20 to-transparent">
        <form 
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 md:gap-3 bg-white/[0.03] border border-white/10 p-1.5 md:p-2 pl-4 md:pl-5 rounded-[2rem] focus-within:border-indigo-500/50 transition-all shadow-2xl backdrop-blur-xl"
        >
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Orbit your message..."
            className="flex-1 bg-transparent border-none outline-none text-white text-[13px] md:text-sm placeholder-gray-600"
          />
          
          <div className="flex items-center gap-1">
            <input
              onChange={handleSendImage}
              type="file"
              id="image"
              accept="image/*"
              hidden
            />
            <label 
              htmlFor="image"
              className="p-2 hover:bg-white/5 rounded-full cursor-pointer transition-colors group"
            >
              <img
                src={assets.gallery_icon}
                alt="gallery"
                className="w-4 md:w-5 opacity-40 group-hover:opacity-100"
              />
            </label>
            
            <button
              type="submit"
              className="p-2.5 md:p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all shadow-lg shadow-indigo-500/20 active:scale-90"
            >
              <img
                src={assets.send_button}
                alt="send"
                className="w-4 md:w-5 brightness-200"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    /* Empty State for Desktop (Mobile will show Sidebar instead) */
    <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8 bg-transparent">
      <div className="w-20 h-20 md:w-24 md:h-24 mb-6 relative">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
          <div className="relative bg-white/5 border border-white/10 w-full h-full rounded-full flex items-center justify-center backdrop-blur-md">
             <img src={assets.logo_icon} alt="" className="w-8 md:w-10 opacity-40" />
          </div>
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-white/80 tracking-tight">Your Orbit</h2>
      <p className="text-gray-500 text-xs md:text-sm max-w-[200px] mt-2">Select an orbiter to start a conversation.</p>
    </div>
  );
};

export default ChatContainer;