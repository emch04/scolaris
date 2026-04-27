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

    // Mémoriser l'URL du crash pour l'auto-guérison future
    sessionStorage.setItem('last_crashed_url', window.location.href);

    // Tentative de "Silent Recovery" (Récupération Silencieuse)
    const recoveryCount = parseInt(sessionStorage.getItem('silent_recovery_attempts') || '0');
    if (recoveryCount < 1) {
      sessionStorage.setItem('silent_recovery_attempts', '1');
      console.log("🛠️ Tentative de récupération silencieuse (Auto-Heal)...");
      // On nettoie les caches potentiellement corrompus sans déconnecter
      localStorage.removeItem('tedp_user'); 
      window.location.reload();
      return;
    }

    // Si on arrive ici, le Silent Recovery a échoué, on rapporte le crash fatal
    const reportCrash = async () => {
      try {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const baseURL = isLocal ? "http://localhost:5001/api" : "/api";

        // Récupération manuelle du token depuis le storage
        const token = localStorage.getItem("tedp_token");

        await axios.post(`${baseURL}/logs/report`, {
          message: error.toString(),
          stack: errorInfo.componentStack,
          url: window.location.href,
          level: 'FATAL'
        }, { 
          timeout: 5000,
          withCredentials: true,
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

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
