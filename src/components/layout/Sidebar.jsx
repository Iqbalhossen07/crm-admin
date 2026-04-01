import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2"; // 🔥 SweetAlert2 ইমপোর্ট
import logo from "../../assets/logo.png";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate(); // 🔥 নেভিগেট করার জন্য
  const activePath = location.pathname;

  // 🚀 প্রফেশনাল লগআউট লজিক
  const handleLogout = () => {
    Swal.fire({
      title:
        '<span style="font-family: Merriweather, serif; font-weight: 900;">Logout?</span>',
      text: "Are you sure you want to end your session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#f3f4f6",
      confirmButtonText: "YES, LOGOUT",
      cancelButtonText:
        '<span style="color: #9ca3af; font-weight: 800;">CANCEL</span>',
      reverseButtons: true,
      background: "#ffffff",
      customClass: {
        popup: "rounded-[2.5rem] p-8 shadow-2xl border border-gray-50",
        confirmButton:
          "px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase outline-none",
        cancelButton:
          "px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase outline-none",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // ১. লোকাল স্টোরেজ ক্লিয়ার
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        // ২. লগইন পেইজে রিডাইরেক্ট
        navigate("/login");
      }
    });
  };

  const menuItems = [
    { label: "Management", type: "header" },
    { label: "Dashboard", path: "/", icon: "fa-solid fa-grip" },
    { label: "Clients", path: "/clients", icon: "fa-solid fa-users" },
    { label: "Projects", path: "/projects", icon: "fa-solid fa-briefcase" },
    { label: "Jobs", path: "/jobs", icon: "fa-solid fa-list-check" },
    {
      label: "Payments",
      path: "/payments",
      icon: "fa-solid fa-file-invoice-dollar",
    },
    { label: "Team", type: "header" },
    {
      label: "Developers",
      path: "/developers",
      icon: "fa-solid fa-laptop-code",
    },
    {
      label: "Account",
      path: "/account",
      icon: "fa-solid fa-laptop-code",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`
        fixed inset-y-0 left-0 z-[70] bg-white 
        w-full sm:w-[350px] lg:w-[300px] 
        transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
        lg:translate-x-0 lg:static lg:h-screen flex flex-col border-r border-gray-100 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between gap-4 px-8 py-7">
          <div className="flex items-center gap-4">
            <img src={logo} alt="" className="w-40" />
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar px-4 pb-10">
          {menuItems.map((item, index) => {
            const isActive =
              item.path === "/"
                ? activePath === "/"
                : activePath.startsWith(item.path);

            return item.type === "header" ? (
              <p
                key={index}
                className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-8 mb-4 px-5"
              >
                {item.label}
              </p>
            ) : (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                flex items-center gap-5 px-6 py-4 text-sm font-bold rounded-2xl transition-all duration-300 group relative
                ${isActive ? "bg-black text-white shadow-xl shadow-black/20" : "text-gray-500 hover:bg-gray-50 hover:text-black"}
              `}
              >
                <i
                  className={`
                ${item.icon} w-6 text-center text-lg transition-all duration-300 
                ${isActive ? "text-white scale-110" : "text-gray-400 group-hover:text-black"}
              `}
                ></i>

                <span className="relative z-10">{item.label}</span>

                {item.badge && (
                  <span
                    className={`
                  ml-auto px-2.5 py-1 rounded-lg text-[10px] font-black 
                  ${isActive ? "bg-white/20 text-white" : "bg-red-500 text-white shadow-md shadow-red-200"}
                `}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1.5 h-6 bg-[#0F8FF0] rounded-r-full shadow-[0_0_10px_rgba(15,143,240,0.8)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 🔥 আপডেট করা লগআউট বাটন */}
        <div className="mt-auto p-6 border-t border-gray-50 bg-gray-50/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-5 px-6 py-4 text-sm font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group outline-none"
          >
            <i className="fa-solid fa-right-from-bracket w-6 text-center text-lg transition-transform group-hover:-translate-x-1"></i>
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Floating Bottom Nav - Mobile */}
      <div className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] bg-white/90 backdrop-blur-xl border border-gray-100 px-2 py-2.5 z-[50] flex items-center justify-around rounded-[1.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.12)]">
        {menuItems
          .filter((i) => i.path)
          .slice(0, 5)
          .map((item, index) => {
            const isActive =
              item.path === "/"
                ? activePath === "/"
                : activePath.startsWith(item.path);
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex flex-col items-center justify-center min-w-[50px] transition-all duration-300 ${isActive ? "text-[#0F8FF0]" : "text-gray-400"}`}
              >
                <i
                  className={`${item.icon} text-[16px] ${isActive ? "scale-110" : ""}`}
                ></i>
                <span className="text-[7px] font-black uppercase tracking-wider mt-1">
                  {item.label.substring(0, 4)}
                </span>
              </Link>
            );
          })}
        {/* Full Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center justify-center min-w-[50px] text-gray-400 active:scale-90 transition-transform"
        >
          <div className="w-4 h-4 flex flex-col justify-center items-center gap-0.5">
            <span className="w-full h-[2px] bg-black rounded-full" />
            <span className="w-2/3 h-[2px] bg-[#0F8FF0] rounded-full self-start" />
          </div>
          <span className="text-[7px] font-black uppercase tracking-wider mt-1">
            Menu
          </span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
