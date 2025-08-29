import React, { useContext } from "react";
import SideBar from "../components/Sidebar.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import RightSidebar from "../components/RightSidebar.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";

const HomePage = () => {
  const { selectedUser, isRightSidebarOpen } = useContext(ChatContext);

  const gridCols =
    selectedUser
      ? (isRightSidebarOpen
          ? "md:grid-cols-[1fr_2fr_360px] xl:grid-cols-[1fr_2.2fr_360px]" // 3 cols when open
          : "md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2.2fr]")           // 2 cols when closed
      : "md:grid-cols-2";

  return (
    <div className="w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={[
          "w-full h-full backdrop-blur-xl border-2 border-r-gray-600 rounded-2xl overflow-hidden",
          "grid grid-cols-1 relative",
          gridCols,
        ].join(" ")}
      >
        <SideBar />
        <ChatContainer />
        {/* Desktop column only rendered when open; mobile overlay is handled inside RightSidebar */}
        {isRightSidebarOpen && <RightSidebar />}
      </div>
    </div>
  );
};

export default HomePage;
