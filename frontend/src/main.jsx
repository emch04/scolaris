/**
 * @file main.jsx
 * @description Point d'entrée de l'application React. Initialise le rendu DOM et configure les différents contextes (Auth, Toast, Theme).
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
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
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}