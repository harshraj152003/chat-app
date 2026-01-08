import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const navigate = useNavigate();

  const {
    getUsers,
    users = [], 
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");

  const filteredUsers = (users ?? []).filter((user) =>
    user.fullName.toLowerCase().includes(input.toLowerCase())
  );

  useEffect(() => {
    getUsers();
  }, []); 

  const handleUserClick = (user) => {
    setSelectedUser(user);
    if (unseenMessages && unseenMessages[user._id]) {
      setUnseenMessages((prev) => {
        const newState = { ...prev };
        delete newState[user._id];
        return newState;
      });
    }
  };

  return (
    <div
      className={`bg-black/20 h-full p-4 md:p-6 overflow-y-auto text-white flex flex-col transition-all duration-300 ${
        // Mobile par jab user select ho to sidebar hide ho jaye
        selectedUser ? "hidden md:flex" : "flex w-full"
      }`}
    >
      {/* --- Header & Orbit Branding --- */}
      <div className="pb-6 shrink-0">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
              <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-[spin_3s_linear_infinite]"></div>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-white">Orbit</h1>
          </div>

          <div className="relative group">
            <div className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
              <img src={assets.menu_icon} alt="menu" className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            </div>
            {/* Dropdown Menu - Fixed positioning for better mobile view */}
            <div className="absolute top-full right-0 z-50 w-40 mt-2 p-2 rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl hidden group-hover:block animate-in fade-in slide-in-from-top-2">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left p-3 rounded-xl text-sm hover:bg-white/5 transition-colors"
              >
                Profile Settings
              </button>
              <div className="h-[1px] bg-white/5 my-1" />
              <button 
                onClick={logout} 
                className="w-full text-left p-3 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-colors"
              >
                Logout Account
              </button>
            </div>
          </div>
        </div>
        
        {/* Modern Search Bar */}
        <div className="group relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <img src={assets.search_icon} alt="Search" className="w-3.5 opacity-40 group-focus-within:opacity-100 transition-opacity" />
          </div>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="w-full bg-white/5 border border-white/5 p-3 md:p-3.5 pl-11 rounded-2xl text-sm text-white placeholder-gray-500 outline-none focus:bg-white/[0.08] focus:border-indigo-500/50 transition-all"
            placeholder="Search orbit..."
          />
        </div>
      </div>

      {/* --- User List Section --- */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              onClick={() => handleUserClick(user)}
              key={user._id}
              className={`group relative flex items-center gap-3 md:gap-4 p-3 rounded-[1.25rem] cursor-pointer transition-all duration-300 ${
                selectedUser?._id === user._id 
                  ? "bg-indigo-600/20 border border-indigo-500/20 shadow-lg shadow-indigo-500/5" 
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt="Profile"
                  className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl object-cover transition-transform group-hover:scale-105 ${
                    selectedUser?._id === user._id ? "border-2 border-indigo-500/50" : "border border-white/10"
                  }`}
                />
                {onlineUsers?.includes(user._id) && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-green-500 border-[3px] border-[#0f172a] rounded-full shadow-lg" />
                )}
              </div>
              
              <div className="flex flex-col leading-tight flex-1 overflow-hidden">
                <p className={`font-semibold truncate text-[15px] md:text-base ${selectedUser?._id === user._id ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                  {user.fullName}
                </p>
                <span className={`text-[11px] md:text-xs mt-0.5 ${onlineUsers?.includes(user._id) ? "text-indigo-400 font-medium" : "text-gray-500"}`}>
                  {onlineUsers?.includes(user._id) ? "Active Now" : "Currently Away"}
                </span>
              </div>

              {unseenMessages?.[user._id] > 0 && (
                <div className="shrink-0 bg-indigo-500 text-[10px] font-black text-white h-5 w-5 flex justify-center items-center rounded-lg shadow-lg shadow-indigo-500/40">
                  {unseenMessages[user._id]}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-10 opacity-30">
            <p className="text-xs">Empty Orbit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;