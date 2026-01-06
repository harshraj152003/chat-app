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
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-auto text-white flex flex-col ${
        selectedUser ? "max-md:hidden" : "w-full"
      }`}
    >
      <div className="pb-5 shrink-0">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm hover:text-white"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p 
                onClick={logout} 
                className="cursor-pointer text-sm hover:text-red-400"
              >
                Logout
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User ..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto flex-1">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              onClick={() => handleUserClick(user)}
              key={user._id}
              className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUser?._id === user._id ? "bg-[#282142]" : "hover:bg-[#282142]/30"
              }`}
            >
              <div className="relative">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border border-gray-600"
                />
                {onlineUsers?.includes(user._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1e1a33] rounded-full" />
                )}
              </div>
              
              <div className="flex flex-col leading-tight overflow-hidden">
                <p className="font-medium truncate">{user.fullName}</p>
                <span className={`text-[11px] ${onlineUsers?.includes(user._id) ? "text-green-400" : "text-neutral-400"}`}>
                  {onlineUsers?.includes(user._id) ? "Online" : "Offline"}
                </span>
              </div>

              {unseenMessages?.[user._id] > 0 && (
                <div className="absolute right-4 bg-violet-600 text-[10px] font-bold h-5 w-5 flex justify-center items-center rounded-full">
                  {unseenMessages[user._id]}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-xs text-gray-500 mt-10">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;