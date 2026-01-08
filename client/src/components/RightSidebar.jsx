import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    selectedUser && (
      <div
        className={`h-full bg-black/10 text-white w-full relative flex flex-col transition-all duration-300 ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        {/* --- Profile Header Area --- */}
        <div className="pt-12 pb-8 flex flex-col items-center px-6 text-center">
          <div className="relative group mb-4">
            {/* Animated Orbit Ring */}
            <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              className="relative w-24 h-24 aspect-square rounded-[2rem] object-cover border-2 border-white/10 shadow-2xl"
              alt="Profile"
            />
          </div>
          
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            {selectedUser.fullName}
            {onlineUsers?.includes(selectedUser._id) && (
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
            )}
          </h1>
          
          <p className="mt-3 text-sm text-gray-400 font-light leading-relaxed italic">
            "{selectedUser.bio || "No bio added yet"}"
          </p>
        </div>

        <div className="px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* --- Media Gallery Section --- */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Shared Media</p>
            <span className="text-[10px] text-gray-500">{msgImages.length} files</span>
          </div>

          {msgImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {msgImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url)}
                  className="group cursor-pointer aspect-square rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all shadow-lg"
                >
                  <img 
                    src={url} 
                    alt="shared" 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 opacity-20">
              <img src={assets.gallery_icon} className="w-8 mb-2 invert" alt="" />
              <p className="text-[10px]">No media in orbit</p>
            </div>
          )}
        </div>

        {/* --- Logout Section (Orbit Style) --- */}
        <div className="p-6 mt-auto">
          <button
            onClick={() => logout()}
            className="w-full py-3.5 bg-white/5 border border-white/10 text-red-400 text-xs font-bold uppercase tracking-widest rounded-2xl cursor-pointer hover:bg-red-400/10 hover:border-red-400/20 transition-all flex items-center justify-center gap-2 group"
          >
             <span className="group-hover:translate-x-1 transition-transform">Logout Session</span>
          </button>
        </div>
      </div>
    )
  );
};

export default RightSidebar;