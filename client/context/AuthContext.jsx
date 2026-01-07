import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";

axios.defaults.withCredentials = true;
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check if user is authenticated and if so, set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (err) {
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function to handle user authentication and socket connection
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);

        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
      return false;
    }
  };

  // Logout function to haqndle user logout and socket disconnection
  const logout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");

      if (data.success) {
        setAuthUser(null);
        setOnlineUsers([]);

        if (socket) {
          socket.disconnect();
          setSocket(null);
        }
        toast.success("Logged out successfully");
      }
    } catch (err) {
      console.error("Logout Error:", err);
      toast.error("Logout failed!");

      setAuthUser(null);
      if (socket) socket.disconnect();
    }
  };

  // Update profile function to handle user profile updates.
  const updateProfile = async (updateData) => {
  try {
    const { data } = await axios.put("/api/auth/update-profile", updateData);
    
    if (data.success) {
      setAuthUser(data.user);
      toast.success("Profile updated successfully!");
      return true; 
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    toast.error(errorMsg);
    return false;
  }
};

  // Connect socket function to handle socket connection and online users updates.
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#000b14]">
        <div className="w-10 h-10 border-4 border-t-violet-600 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
