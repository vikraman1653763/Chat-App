import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const { socket, axios } = useContext(AuthContext);

  // Fetch all users for sidebar + unseen counts
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get messages for a given userId
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Centralized "select user" that also persists & fetches
  const selectUser = (user) => {
    setSelectedUser(user);
    if (user?._id) {
      localStorage.setItem("selectedUserId", user._id);
      getMessages(user._id);
    } else {
      localStorage.removeItem("selectedUserId");
      setMessages([]); // clear view when no user selected
    }
  };

  // Load users on mount (and whenever presence changes, if desired)
  useEffect(() => {
    getUsers();
  }, []);

  // Rehydrate selected user after users are loaded
  useEffect(() => {
    if (!users?.length) return;
    const savedId = localStorage.getItem("selectedUserId");
    if (!savedId) return;
    const found = users.find((u) => u._id === savedId);
    if (found) {
      // Use the centralized selector to also load messages
      selectUser(found);
      // Clear unseen for restored user
      setUnseenMessages((prev) => ({ ...prev, [found._id]: 0 }));
    }
  }, [users]); // eslint-disable-line react-hooks/exhaustive-deps

  // Send a message to the currently selected user
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error("Failed to send");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Socket subscription: handle incoming messages
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      // If we are chatting with this sender, append & mark as seen
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        // Otherwise, bump unseen count for that sender
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev?.[newMessage.senderId] || 0) + 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    selectUser,            
    getUsers,
    getMessages,
    sendMessage,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
