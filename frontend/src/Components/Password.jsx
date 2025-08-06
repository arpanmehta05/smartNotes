import React, { useState } from "react";
import EyeIcon from "../Icons/EyeIcon";
import EyeOffIcon from "../Icons/EyeOffIcon";

export default function Password({ onSubmit }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    if (onSubmit) onSubmit(password, confirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Set Your Password
        </h2>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOffIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow"
        >
          Set Password
        </button>
      </form>
    </div>
  );
}
