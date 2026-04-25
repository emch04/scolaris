/**
 * @file GuidePage.jsx
 * @description Page de guide d'utilisation complète pour Scolaris.
 * Détaille l'installation PWA, l'utilisation par rôle et la hiérarchie du système.
 */

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function GuidePage() {
  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: "900px", padding: "clamp(2rem, 8vw, 4rem) 1.5rem 5rem" }}>
        <header style={{ textAlign: "center", marginBottom: "clamp(2rem, 10vw, 4rem)" }}>
          <h1 style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", fontWeight: "900", marginBottom: "0.8rem", lineHeight: "1.1" }}>Guide d'Utilisation</h1>
          <p style={{ opacity: 0.7, fontSize: "clamp(0.9rem, 4vw, 1.1rem)" }}>
            Mis à jour le <strong>22 avril 2026</strong>
          </p>
        </header>

        {/* Section PWA */}
        <section className="card" style={{ marginBottom: "2rem", borderLeft: "4px solid var(--primary)", padding: "1.5rem" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.3rem" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            Installation Mobile (PWA)
          </h2>
          <p style={{ marginTop: "0.8rem", opacity: 0.8, fontSize: "0.95rem" }}>
            Scolaris est une Progressive Web App (PWA). Utilisez-la comme une application native sans passer par les stores.
          </p>
          <ul style={{ marginTop: "1rem", paddingLeft: "1.2rem", lineHeight: "1.7", fontSize: "0.9rem" }}>
            <li style={{ marginBottom: "8px" }}><strong>iPhone (iOS)</strong> : Ouvrez dans Safari, appuyez sur <strong>Partager</strong> puis <strong>"Sur l'écran d'accueil"</strong>.</li>
            <li style={{ marginBottom: "8px" }}><strong>Android</strong> : Ouvrez dans Chrome, appuyez sur les <strong>trois points</strong> puis <strong>"Installer l'application"</strong>.</li>
            <li><strong>Avantages</strong> : Accès rapide, navigation plein écran et fonctionnement fluide.</li>
          </ul>
        </section>

        {/* Section Hiérarchie */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center", fontSize: "1.5rem" }}>Rôles & Responsabilités</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {[
              { role: "Super Admin", desc: "Pilote le réseau national, gère les écoles et les statistiques." },
              { role: "Directeur", desc: "Administre l'établissement, valide les profs et configure les classes." },
              { role: "Enseignant", desc: "Publie les devoirs, fait l'appel et communique avec les familles." },
              { role: "Élève", desc: "Consulte son horaire, participe au chat et suit ses progrès." },
              { role: "Parent", desc: "Surveille la réussite et valide les devoirs par signature numérique." }
            ].map((r, i) => (
              <div key={i} className="card" style={{ textAlign: "center", padding: "1.2rem" }}>
                <h3 style={{ color: "var(--primary)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{r.role}</h3>
                <p style={{ fontSize: "0.85rem", opacity: 0.7, margin: 0 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section Fonctionnement */}
        <section className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.3rem" }}>Fonctionnement Clé</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "5px" }}>1. Connexion Sécurisée</h3>
              <p style={{ opacity: 0.7, fontSize: "0.9rem", margin: 0 }}>Utilisez votre matricule unique. Déconnexion automatique après 15 min d'inactivité pour protéger vos données.</p>
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "5px" }}>2. Mode Hors-ligne</h3>
              <p style={{ opacity: 0.7, fontSize: "0.9rem", margin: 0 }}>Vos données (horaires, devoirs) sont stockées localement. Consultez-les partout, même sans réseau.</p>
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "5px" }}>3. Communication Directe</h3>
              <p style={{ opacity: 0.7, fontSize: "0.9rem", margin: 0 }}>Chat de classe pour l'entraide entre élèves et messagerie privée pour le lien parents-profs.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default GuidePage;
