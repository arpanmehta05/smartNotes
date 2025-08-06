import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Trash from "./Components/Trash";
import Error from "./Components/Error";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import PrivateRoute from "./Components/PrivateRoute";
import GoogleAuthHandler from "./Components/GoogleAuthHandler";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/google/callback" element={<GoogleAuthHandler />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/trash"
          element={
            <PrivateRoute>
              <Trash />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
