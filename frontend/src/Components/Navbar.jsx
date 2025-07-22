import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import LogoIcon from "../Icons/LogoIcon";
import HomeIcon from "../Icons/HomeIcon";
import BinIcon from "../Icons/Bin";
import SearchIcon from "../Icons/SearchIcon";
import CrossIcon from "../Icons/CrossIcon";

const Navbar = ({ onSearch, onToggleSelectMode, isSelectMode }) => {
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
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <LogoIcon className="w-8 h-8 text-yellow-500" />
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              Smartnotes
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
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

          {/* Navigation Actions */}
          <div className="flex items-center gap-3">
            {/* Select Mode Toggle */}
            <button
              onClick={onToggleSelectMode}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelectMode
                  ? "bg-gray-800 text-white shadow-md hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
              }`}
            >
              {isSelectMode ? "Cancel" : "Select"}
            </button>

            {/* Navigation Links */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `p-3 rounded-full transition-all duration-200 ${
                  isActive ? activeLinkStyle : inactiveLinkStyle
                }`
              }
              title="Home"
            >
              <HomeIcon className="w-5 h-5" />
            </NavLink>

            <NavLink
              to="/trash"
              className={({ isActive }) =>
                `p-3 rounded-full transition-all duration-200 ${
                  isActive ? activeLinkStyle : inactiveLinkStyle
                }`
              }
              title="Trash"
            >
              <BinIcon className="w-5 h-5" />
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
