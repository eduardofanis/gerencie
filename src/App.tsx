import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import AuthStorage from "./contexts/AuthContext";
import { UserProtectedRoute } from "./routes/UserProtectedRoute";
import Customers from "./components/Customers/Customers";
import { Toaster } from "./components/ui/toaster";
import Operations from "./components/Operations/Operations";
import SignUp from "./components/SignUp/SignUp";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Account from "./components/Account/Account";
import Sidebar from "./components/Sidebar/Sidebar";
import Collaborators from "./components/Collaborators/Collaborators";
import Automations from "./components/Automations/Automations";
import SubscriberStorage from "./contexts/SubscriberContext";
import CollaboratorStorage from "./contexts/CollaboratorContext";
import {
  HighSubscriberProtectedRoute,
  MidSubscriberProtectedRoute,
  SubscriberProtectedRoute,
} from "./routes/SubscriberProtectedRoute";
import {
  CollaboratorProtectedRoute,
  ManageAutomationsProtectedRoute,
  ManageOthersCollaboratorsProtectedRoute,
} from "./routes/CollaboratorProtectedRoute";

export default function App() {
  return (
    <main className="h-full">
      <BrowserRouter>
        <AuthStorage>
          <SubscriberStorage>
            <CollaboratorStorage>
              <div className="grid grid-cols-[auto_1fr]">
                <Sidebar />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <UserProtectedRoute>
                        <SubscriberProtectedRoute>
                          <CollaboratorProtectedRoute>
                            <Home />
                          </CollaboratorProtectedRoute>
                        </SubscriberProtectedRoute>
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
                        <SubscriberProtectedRoute>
                          <CollaboratorProtectedRoute>
                            <Operations />
                          </CollaboratorProtectedRoute>
                        </SubscriberProtectedRoute>
                      </UserProtectedRoute>
                    }
                  />
                  <Route
                    path="/clientes"
                    element={
                      <UserProtectedRoute>
                        <SubscriberProtectedRoute>
                          <CollaboratorProtectedRoute>
                            <Customers />
                          </CollaboratorProtectedRoute>
                        </SubscriberProtectedRoute>
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
                    path="/colaboradores"
                    element={
                      <UserProtectedRoute>
                        <SubscriberProtectedRoute>
                          <MidSubscriberProtectedRoute>
                            <CollaboratorProtectedRoute>
                              <ManageOthersCollaboratorsProtectedRoute>
                                <Collaborators />
                              </ManageOthersCollaboratorsProtectedRoute>
                            </CollaboratorProtectedRoute>
                          </MidSubscriberProtectedRoute>
                        </SubscriberProtectedRoute>
                      </UserProtectedRoute>
                    }
                  />
                  <Route
                    path="/automacoes"
                    element={
                      <UserProtectedRoute>
                        <SubscriberProtectedRoute>
                          <HighSubscriberProtectedRoute>
                            <CollaboratorProtectedRoute>
                              <ManageAutomationsProtectedRoute>
                                <Automations />
                              </ManageAutomationsProtectedRoute>
                            </CollaboratorProtectedRoute>
                          </HighSubscriberProtectedRoute>
                        </SubscriberProtectedRoute>
                      </UserProtectedRoute>
                    }
                  />
                </Routes>
              </div>
              <Toaster />
            </CollaboratorStorage>
          </SubscriberStorage>
        </AuthStorage>
      </BrowserRouter>
    </main>
  );
}
