import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => { 
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        console.log(data);
        setUsers(data.user);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const getMessages = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      
      if (data.success) {
        setMessages(data.data || []);
      }
    } catch (err) {
      setMessages([]);
      toast.error("Failed to load messages");
    }
  }, [axios]);

  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      console.log("Backend Response Data:", data);

      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send");
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const isFromSelected = selectedUser && newMessage.senderId === selectedUser._id;
      
      if (isFromSelected) {
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`).catch(() => {});
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    if (selectedUser?._id) {
        getMessages(selectedUser._id);
    }

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser, getMessages, axios]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};