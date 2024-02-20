import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import AuthStorage from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Customers from "./components/Customers/Customers";
import { Toaster } from "./components/ui/toaster";
import Operations from "./components/Operations/Operations";
import Preferences from "./components/Preferences/Preferences";
import SignUp from "./components/SignUp/SignUp";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";

export default function App() {
  return (
    <main>
      <BrowserRouter>
        <AuthStorage>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/password_reset" element={<ForgotPassword />} />
            <Route
              path="/operacoes"
              element={
                <ProtectedRoute>
                  <Operations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clientes"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preferencias"
              element={
                <ProtectedRoute>
                  <Preferences />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </AuthStorage>
      </BrowserRouter>
    </main>
  );
}
