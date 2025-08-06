import React, { useState, useCallback } from "react";
import { NavLink, Link } from "react-router-dom";
import LogoIcon from "../Icons/LogoIcon";
import HomeIcon from "../Icons/HomeIcon";
import BinIcon from "../Icons/Bin";
import SearchIcon from "../Icons/SearchIcon";
import CrossIcon from "../Icons/CrossIcon";
import HamburgerIcon from "../Icons/HamburgerIcon";

const Navbar = ({ onSearch, isSelectMode, sidebarOpen, setSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const activeLinkStyle = "bg-gray-100 text-gray-800 shadow-sm";
  const inactiveLinkStyle =
    "text-gray-500 hover:bg-gray-50 hover:text-gray-700";

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      if (onSearch) {
        onSearch(query);
      }
    },
    [onSearch]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center h-16 px-4 gap-4">
        {/* Hamburger and Logo group */}
        <div className="flex items-center gap-2 min-w-fit">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
            type="button"
          >
            <HamburgerIcon className="w-7 h-7" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <LogoIcon className="w-8 h-8 text-yellow-500" />
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              Smartnotes
            </span>
          </Link>
        </div>
        {/* Centered Search Bar */}
        <div className="flex-1 flex justify-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search your notes..."
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder-gray-400 text-gray-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CrossIcon className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
