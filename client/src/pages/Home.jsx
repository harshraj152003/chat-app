import { useContext } from "react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import ChatContainer from "../components/ChatContainer";
import { ChatContext } from "../../context/ChatContext";

const Home = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black flex items-center justify-center p-0 sm:p-3 md:p-6 lg:p-10 font-sans">
      
      <div
        className={`
          bg-[#0f172a]/40 backdrop-blur-3xl 
          border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]
          rounded-none sm:rounded-[2.5rem] 
          overflow-hidden w-full h-full max-w-[1700px]
          /* Desktop par grid, Mobile par simple block */
          grid relative transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
          ${
            selectedUser
              ? "md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr_320px] xl:grid-cols-[380px_1fr_350px]"
              : "grid-cols-1 md:grid-cols-[350px_1fr]"
          }
        `}
      >
        {/* Sidebar: Mobile par hide hoga agar user selected hai */}
        <div className={`
          border-r border-white/[0.08] h-full bg-black/10
          ${selectedUser ? "hidden md:block" : "block"}
        `}>
          <Sidebar />
        </div>

        <div className={`
          h-full flex flex-col relative overflow-hidden bg-linear-to-b from-transparent to-black/5
          ${selectedUser ? "block" : "hidden md:flex"}
        `}>
          <ChatContainer />
        </div>

        {selectedUser && (
          <div className="hidden lg:block border-l border-white/8 h-full bg-black/10 animate-in fade-in slide-in-from-right-10 duration-500 ease-out">
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;