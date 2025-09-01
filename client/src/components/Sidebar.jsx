import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const SideBar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    selectUser,         // ✅ use centralized selector
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers, authUser } = useContext(AuthContext);
  const [query, setQuery] = useState(""); // ✅ string (was boolean)
  const navigate = useNavigate();

  // Refresh users list when presence changes (optional)
  useEffect(() => {
    getUsers();
  }, [onlineUsers]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter users by search and exclude current user
  const filteredUsers = (query.trim()
    ? users.filter((user) =>
        user.fullName?.toLowerCase().includes(query.toLowerCase())
      )
    : users
  ).filter((user) => user._id !== authUser?._id);

  const handleSelect = (user) => {
    selectUser(user); // persists + fetches
    setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
  };

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-xl overflow-y-scroll text-white ${
        selectedUser ? " max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} className="max-w-40" alt="logo" />
          <div className="relative group py-2">
            <img
              src={assets.menu_icon}
              className="max-h-5 cursor-pointer"
              alt="menu-icon"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md hidden text-gray-100 border border-gray-600 group-hover:block bg-[#282142]">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={logout} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search user..."
          />
        </div>
      </div>


      <div className="flex flex-col">
        {filteredUsers.map((user) => {
          const unseen = unseenMessages?.[user._id] || 0;
          const isSelected = selectedUser?._id === user._id;

          return (
            <div
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                isSelected ? "bg-[#282142]/50" : ""
              }`}
              key={user._id}
              onClick={() => handleSelect(user)}
            >
              <img
                src={user.profilePic || assets.avatar_icon}
                alt="Profile image"
                className="w-[35px] aspect-[1/1] rounded-full"
              />
              <div className="flex flex-col leading-5">
                <p>{user.fullName}</p>
                {onlineUsers.includes(user._id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral-400 text-xs">Offline</span>
                )}
              </div>

              {unseen > 0 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                  {unseen}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
