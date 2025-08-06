import React from "react";

const InfoModal = ({ isOpen, message, onClose, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-100 flex flex-col items-center">
        {title && (
          <div className="mb-2 text-yellow-600 font-semibold text-lg w-full text-center">
            {title}
          </div>
        )}
        <div className="mb-6 text-gray-700 text-center text-base font-medium">{message}</div>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors w-full font-semibold shadow"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default InfoModal;
