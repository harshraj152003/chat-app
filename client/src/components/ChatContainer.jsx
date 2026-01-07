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
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* -------- Header --------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-8 rounded-full"
          alt=""
        />
        <div className="flex-1">
          <p className="text-lg text-white flex items-center gap-2">
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && (
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            )}
          </p>
        </div>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>

      {/* -------- Chat Area ---------  */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages &&
          messages.map((msg, index) => {
            if (!msg) return null;

            return (
              <div
                key={msg._id || index}
                className={`flex items-end gap-2 mb-8 ${
                  msg.senderId === authUser._id
                    ? "justify-end"
                    : "flex-row-reverse justify-end"
                }`}
              >
                <div
                  className={`flex flex-col ${
                    msg.senderId === authUser._id ? "items-end" : "items-start"
                  }`}
                >
                  {msg.image ? (
                    <img
                      src={msg.image}
                      alt=""
                      className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                    />
                  ) : (
                    <p
                      className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all text-white ${
                        msg.senderId === authUser._id
                          ? "bg-violet-500/30 rounded-br-none"
                          : "bg-zinc-800 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </p>
                  )}
                  <p className="text-gray-500 text-[10px] mt-1">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>

                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
              </div>
            );
          })}
        <div ref={scrollEnd}></div>
      </div>

      {/* ----------- bottom area ------- */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-[#1e1e1e]">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Type a message..."
            className="flex-1 text-sm p-3 bg-transparent border-none outline-none text-white"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer opacity-70 hover:opacity-100"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer hover:scale-110 transition-transform"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/5 h-full">
      <img src={assets.logo_icon} alt="" className="max-w-16 opacity-20" />
      <p className="text-lg font-medium text-white/50">
        Select a chat to start messaging
      </p>
    </div>
  );
};

export default ChatContainer;
