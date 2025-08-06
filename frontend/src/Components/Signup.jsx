import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../Icons/LogoIcon";
import GoogleIcon from "../Icons/GoogleIcon";
import EyeIcon from "../Icons/EyeIcon";
import EyeOffIcon from "../Icons/EyeOffIcon";
import { useAuth0 } from "@auth0/auth0-react";
import { signup } from "../services/operations/notesAPI";

export default function Signup() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const password = watch("password");

  const handleManualSignup = async (data) => {
    try {
      await signup(data);
      // Redirect to login page after successful signup
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      // You can add state to show an error message to the user
    }
  };
  
  const handleGoogleSignup = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup", // Pre-selects the sign-up tab in Universal Login
        connection: "google-oauth2", // Specify the Google connection
        redirect_uri: window.location.origin + "/auth/google/callback",
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(handleManualSignup)}
        className="bg-white p-12 rounded-3xl shadow-2xl max-w-xl w-full border border-gray-200"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <LogoIcon className="w-12 h-12 text-yellow-500" />
          <span className="text-2xl font-bold text-gray-800 whitespace-nowrap text-center">
            Join Smartnotes and Start Organizing
          </span>
        </div>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-1/2 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            {...register("firstName", { required: "First name is required" })}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-1/2 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            {...register("lastName", { required: "Last name is required" })}
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
        />
        <div className="flex gap-4 mb-6">
          <div className="relative w-1/2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="relative w-1/2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === password || "Passwords do not match"
              })}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mb-2">{errors.confirmPassword.message}</p>}
        <button
          type="submit"
          className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors mb-3 shadow"
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mb-3 shadow"
        >
          <GoogleIcon className="w-5 h-5" />
          Continue with Google
        </button>
        <p className="mt-2 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <span
            className="text-yellow-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}