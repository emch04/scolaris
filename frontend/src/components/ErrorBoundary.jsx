import React from 'react';
import axios from 'axios';

/**
 * @class ErrorBoundary
 * @description Capture les erreurs JavaScript, les affiche à l'utilisateur,
 * et envoie automatiquement un rapport au serveur.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CRASH SYSTÈME DÉTECTÉ:", error, errorInfo);

    // Envoi du rapport d'erreur au backend
    const reportCrash = async () => {
      try {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        // On essaie de détecter le port dynamiquement ou on utilise le port 5001 par défaut pour le backend local
        const baseURL = isLocal ? "http://localhost:5001/api" : "/api";
        
        console.log("Envoi du rapport de crash à :", `${baseURL}/logs/report`);
        
        await axios.post(`${baseURL}/logs/report`, {
          message: error.toString(),
          stack: errorInfo.componentStack,
          url: window.location.href,
          level: 'FATAL'
        }, { timeout: 5000 });
        
        console.log("Rapport de crash envoyé avec succès.");
      } catch (err) {
        console.error("Échec de l'envoi du rapport de crash au serveur:", err.message);
      }
    };

    reportCrash();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          height: "100vh", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          background: "#050505", 
          color: "white", 
          padding: "20px", 
          textAlign: "center" 
        }}>
          <h1 style={{ color: "#ff5252", fontSize: "clamp(2rem, 10vw, 4rem)", marginBottom: "1rem" }}>⚠️ Oups !</h1>
          <h2 style={{ fontSize: "clamp(1rem, 5vw, 1.3rem)", opacity: 0.8 }}>Une erreur inattendue est survenue dans le système.</h2>
          <p style={{ maxWidth: "600px", margin: "1.5rem 0", opacity: 0.6, fontSize: "0.85rem", background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "12px", fontFamily: "monospace", textAlign: "left", overflowX: "auto" }}>
            {this.state.error?.toString()}
          </p>
          
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
            <button 
              onClick={() => window.location.reload()}
              style={{ 
                padding: "12px 24px", 
                background: "rgba(255,255,255,0.1)", 
                color: "white", 
                border: "1px solid rgba(255,255,255,0.2)", 
                borderRadius: "12px", 
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Réessayer
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              style={{ 
                padding: "12px 24px", 
                background: "#1A73E8", 
                color: "white", 
                border: "none", 
                borderRadius: "12px", 
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Retourner à l'accueil
            </button>
          </div>
          
          <p style={{ marginTop: "2rem", fontSize: "0.75rem", opacity: 0.4 }}>
            Un rapport a été automatiquement envoyé à l'équipe technique.
          </p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
