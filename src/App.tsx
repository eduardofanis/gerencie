import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import AuthStorage from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Customers from "./components/Customers/Customers";
import { Toaster } from "./components/ui/toaster";
import Operations from "./components/Operations/Operations";

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
          </Routes>
          <Toaster />
        </AuthStorage>
      </BrowserRouter>
    </main>
  );
}
