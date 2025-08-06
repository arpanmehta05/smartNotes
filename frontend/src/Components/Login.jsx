import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../Icons/LogoIcon";
import GoogleIcon from "../Icons/GoogleIcon";
import { useAuth0 } from "@auth0/auth0-react";
import { login } from "../services/operations/notesAPI";
import ErrorModal from "./ErrorModal";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleManualLogin = async (data) => {
    try {
      const response = await login(data);
      localStorage.setItem("token", response.token);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } catch (error) {
      setErrorMsg("Invalid email or password. Please try again.");
      setShowError(true);
    }
  };

  const handleGoogleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2", // Specify the Google connection
        redirect_uri: window.location.origin + "/auth/google/callback",
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(handleManualLogin)}
        className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-200"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <LogoIcon className="w-9 h-9 text-yellow-500" />
          <span className="text-2xl font-bold text-gray-800 whitespace-nowrap">
            Welcome back to Smartnotes
          </span>
        </div>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="text-red-500 text-xs mb-2">{errors.email.message}</p>}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p className="text-red-500 text-xs mb-2">{errors.password.message}</p>}
        <button
          type="submit"
          className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors mb-3 shadow"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin} // Updated handler
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mb-3 shadow"
        >
          <GoogleIcon className="w-5 h-5" />
          Continue with Google
        </button>
        <p className="mt-2 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <span
            className="text-yellow-500 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </form>
      <ErrorModal isOpen={showError} message={errorMsg} onClose={() => setShowError(false)} />
    </div>
  );
}