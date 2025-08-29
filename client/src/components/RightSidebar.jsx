import React, { useContext, useMemo } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { IoIosCloseCircleOutline } from "react-icons/io";

const RightSidebar = () => {
  const {
    selectedUser,
    messages,
    isRightSidebarOpen,
    closeRightSidebar,
  } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const msgImages = useMemo(
    () =>
      (messages || [])
        .filter((m) => !!m?.image)
        .map((m) => ({
          url: m.image,
          id: m._id || `${m.createdAt}-${m.senderId}`,
        }))
        .reverse(),
    [messages]
  );

  if (!selectedUser) return null;

return (
  <>
    {/* Backdrop on ALL sizes */}
    <div
      onClick={closeRightSidebar}
      className={[
        "fixed inset-0 bg-black/40 z-40 transition-opacity duration-300",
        isRightSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      ].join(" ")}
    />

    <aside
      className={[
        "bg-[#8185B2]/10 text-white relative overflow-y-auto h-full",
        // Fixed drawer on all sizes
        "fixed top-0 right-0 w-[85vw] max-w-[360px]",
        "z-50",
        // Slide animation fully controlled by state
        "transition-transform duration-300 ease-in-out",
        isRightSidebarOpen ? "translate-x-0" : "translate-x-full",
      ].join(" ")}
    >
      {/* Close on any size */}
      <button
        onClick={closeRightSidebar}
        className="absolute top-3 right-3 text-white/50 text-2xl "
        >
        
        <IoIosCloseCircleOutline/>
      </button>

      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="avatar"
          className="w-20 aspect-[1/1] rounded-full"
        />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
          {selectedUser.fullName}
        </h1>
        <p className="px-10 mx-auto">{selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 max-h-[300px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgImages.length === 0 && (
            <p className="col-span-2 text-gray-400 text-center py-6">No media yet</p>
          )}
          {msgImages.map(({ url, id }) => (
            <button
              key={id}
              onClick={() => window.open(url, "_blank")}
              className="cursor-pointer rounded block"
              title="Open image"
            >
              <img
                src={url}
                alt="message media"
                className="h-full w-full object-cover rounded-md"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-10 rounded-full"
      >
        Logout
      </button>
    </aside>
  </>
);

};

export default RightSidebar;
