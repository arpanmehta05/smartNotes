import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "../Icons/HomeIcon";
import BinIcon from "../Icons/Bin";
import LogoutIcon from "../Icons/LogoutIcon";
import HamburgerIcon from "../Icons/HamburgerIcon";
import LogoIcon from "../Icons/LogoIcon";

export default function Sidebar({ sidebarOpen, setSidebarOpen, children }) {
  const [sidebarHover, setSidebarHover] = useState(false);
  const navigate = useNavigate();
  const isSidebarVisible = sidebarOpen || sidebarHover;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div
      className={`fixed md:static top-0 left-0 h-full md:h-auto z-40 bg-white outline outline-1 outline-gray-200 flex flex-col items-center pt-3 w-56 group
        transition-all duration-500 ease-in-out
        ${isSidebarVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0 pointer-events-none md:translate-x-0 md:opacity-100 md:pointer-events-auto"}
      `}
      onMouseEnter={() => setSidebarHover(true)}
      onMouseLeave={() => setSidebarHover(false)}
      style={{ boxShadow: 'none' }}
    >
      <div className="flex flex-col items-center gap-8 w-full flex-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full px-6 py-3 rounded-lg transition-colors font-semibold text-lg ${
              isActive
                ? "bg-yellow-100 text-yellow-700"
                : "hover:bg-yellow-100 text-gray-800"
            }`
          }
          onClick={() => setSidebarOpen(false)}
        >
          <HomeIcon className="w-6 h-6" /> <span>Home</span>
        </NavLink>
        <NavLink
          to="/trash"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full px-6 py-3 rounded-lg transition-colors font-semibold text-lg ${
              isActive
                ? "bg-yellow-100 text-yellow-700"
                : "hover:bg-yellow-100 text-gray-800"
            }`
          }
          onClick={() => setSidebarOpen(false)}
        >
          <BinIcon className="w-6 h-6" /> <span>Trash</span>
        </NavLink>
        {/* Render children below navigation links */}
        {children}
      </div>
      {/* Logout button absolutely at the bottom */}
      <button
        className="flex items-center gap-3 w-full px-6 py-3 rounded-lg mb-8 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 font-semibold text-lg absolute bottom-0 left-0"
        onClick={handleLogout}
        style={{ width: '100%' }}
      >
        <LogoutIcon className="w-6 h-6" /> <span>Logout</span>
      </button>
    </div>
  );
} 