import "./globals.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./FirebaseSettings.ts";

export const firebaseApp = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
