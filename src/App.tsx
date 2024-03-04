import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import AuthStorage from "./AuthContext";
import {
  UserProtectedRoute,
  SubscriptionProtectedRoute,
} from "./ProtectedRoute";
import Customers from "./components/Customers/Customers";
import { Toaster } from "./components/ui/toaster";
import Operations from "./components/Operations/Operations";
import SignUp from "./components/SignUp/SignUp";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Account from "./components/Account/Account";
import Sidebar from "./components/Sidebar/Sidebar";

export default function App() {
  return (
    <main className="h-full">
      <BrowserRouter>
        <AuthStorage>
          <div className="grid grid-cols-[auto_1fr]">
            <Sidebar />
            <Routes>
              <Route
                path="/"
                element={
                  <UserProtectedRoute>
                    <SubscriptionProtectedRoute>
                      <Home />
                    </SubscriptionProtectedRoute>
                  </UserProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/password_reset" element={<ForgotPassword />} />
              <Route
                path="/operacoes"
                element={
                  <UserProtectedRoute>
                    <SubscriptionProtectedRoute>
                      <Operations />
                    </SubscriptionProtectedRoute>
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/clientes"
                element={
                  <UserProtectedRoute>
                    <SubscriptionProtectedRoute>
                      <Customers />
                    </SubscriptionProtectedRoute>
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/conta"
                element={
                  <UserProtectedRoute>
                    <Account />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/funcionarios"
                element={
                  <UserProtectedRoute>
                    <SubscriptionProtectedRoute>
                      <Account />
                    </SubscriptionProtectedRoute>
                  </UserProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Toaster />
        </AuthStorage>
      </BrowserRouter>
    </main>
  );
}
