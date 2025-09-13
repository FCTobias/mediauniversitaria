// src/main.tsx (Corrected)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexReactClient } from "convex/react";
// --- FIX: Import the CORRECTLY named provider ---
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import "./i18n";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* --- FIX: Use the component with the new name --- */}
    <ConvexAuthProvider client={convex}>
      <App />
    </ConvexAuthProvider>
  </React.StrictMode>
);