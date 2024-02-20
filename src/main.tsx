import "./globals.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./FirebaseSettings.ts";

export const firebaseApp = initializeApp(firebaseConfig);

let container: HTMLElement | null = null;

document.addEventListener("DOMContentLoaded", function () {
  if (!container) {
    container = document.getElementById("root") as HTMLElement;
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});
