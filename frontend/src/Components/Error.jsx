import React from "react";
import { useNavigate } from "react-router-dom";
import CrumpledPaper from "../Icons/CrumpledPaper";
import HomeIcon from "../Icons/HomeIcon";

export default function Error() {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 font-sans p-4">
      <div className="text-center p-8 border border-gray-200 rounded-2xl bg-gray-50/80 shadow-2xl shadow-black/10 animate-fade-in">
        <CrumpledPaper />
        <h1 className="text-8xl md:text-9xl font-black text-gray-900 tracking-tighter">
          Oops!
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700">
          It seems this page is a blank slate.
        </p>
        <p className="mt-1 text-base text-gray-500">
          The note you are looking for might have been moved or deleted.
        </p>
        <button
          onClick={goHome}
          className="mt-8 inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Return to Your Notes
        </button>
      </div>
      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
