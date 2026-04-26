/**
 * @file main.jsx
 * @description Point d'entrée de l'application React. Configuration des Providers avec l'ordre correct.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { HelmetProvider } from "react-helmet-async";
import "./styles/globals.css";
import { registerSW } from 'virtual:pwa-register';

// Enregistrement du Service Worker pour la PWA
registerSW({ immediate: true });

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("L'élément #root est introuvable dans index.html");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ToastProvider>
            <AuthProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
}
