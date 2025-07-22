import React from "react";

const ErrorModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full border border-gray-200">
        <div className="mb-4 text-red-600 font-semibold text-lg">Error</div>
        <div className="mb-6 text-gray-700">{message}</div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-100 transition-colors w-full border border-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
