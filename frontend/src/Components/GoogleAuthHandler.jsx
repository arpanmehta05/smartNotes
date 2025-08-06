import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { setPassword } from "../services/operations/notesAPI";
import InfoModal from "./InfoModal";
import ErrorModal from "./ErrorModal";
import Password from "./Password";
import axios from "axios";
import { endpoints } from "../services/apis";

export default function GoogleAuthHandler() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [needsPassword, setNeedsPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const syncWithBackend = async () => {
      if (!isAuthenticated || !user) return;
      if (!user.email || !user.sub) {
        setErrorMsg("Google authentication failed: missing user email or ID. Please try again or contact support.");
        setShowError(true);
        return;
      }
      try {
        // Call backend /auth/google endpoint
        const response = await axios.post(endpoints.google, {
          email: user.email,
          firstName: user.given_name || "",
          lastName: user.family_name || "",
          googleId: user.sub,
        });
        setEmail(user.email);
        setToken(response.data.token);
        if (response.data.needsPassword) {
          setNeedsPassword(true);
        } else {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("isAuthenticated", "true");
          setInfoMsg("Login successful!");
          setShowInfo(true);
          setTimeout(() => navigate("/"), 1000);
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.message || "Google login failed.");
        setShowError(true);
      }
    };
    if (!isLoading) syncWithBackend();
    // eslint-disable-next-line
  }, [isAuthenticated, user, isLoading]);

  const handleSetPassword = async (password, confirmPassword) => {
    try {
      await setPassword({ email, password, confirmPassword });
      setNeedsPassword(false);
      setInfoMsg("Password set successfully! You can now log in manually as well.");
      setShowInfo(true);
      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to set password.");
      setShowError(true);
    }
  };

  return (
    <>
      {needsPassword && <Password onSubmit={handleSetPassword} />}
      <ErrorModal isOpen={showError} message={errorMsg} onClose={() => setShowError(false)} />
      <InfoModal isOpen={showInfo} message={infoMsg} onClose={() => setShowInfo(false)} />
    </>
  );
} 