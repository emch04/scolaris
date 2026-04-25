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
      <div className="container" style={{ maxWidth: "900px", paddingBottom: "5rem" }}>
        <header style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "1rem" }}>Guide d'Utilisation</h1>
          <p style={{ opacity: 0.7, fontSize: "1.1rem" }}>
            Officiellement créé le <strong>Jeudi 22 avril 2026</strong>
          </p>
        </header>

        {/* Section PWA */}
        <section className="card" style={{ marginBottom: "3rem", borderLeft: "5px solid var(--primary)" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            Installation Mobile (PWA)
          </h2>
          <p style={{ marginTop: "1rem", opacity: 0.8 }}>
            Scolaris est une Progressive Web App (PWA). Cela signifie que vous pouvez l'utiliser comme une application native sans passer par les stores.
          </p>
          <ul style={{ marginTop: "1rem", paddingLeft: "1.5rem", lineHeight: "1.8" }}>
            <li><strong>Sur iPhone (iOS)</strong> : Ouvrez Scolaris dans Safari, appuyez sur le bouton "Partager" (carré avec flèche) et choisissez <strong>"Sur l'écran d'accueil"</strong>.</li>
            <li><strong>Sur Android</strong> : Ouvrez Scolaris dans Chrome, appuyez sur les trois points en haut à droite et choisissez <strong>"Installer l'application"</strong>.</li>
            <li><strong>Avantages</strong> : Accès instantané, navigation plein écran et fonctionnement fluide même avec une connexion instable.</li>
          </ul>
        </section>

        {/* Section Hiérarchie */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>Hiérarchie & Rôles</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            {[
              { role: "Super Admin", desc: "Pilote le réseau national, gère les écoles et les statistiques globales." },
              { role: "Directeur", desc: "Administre son établissement, valide les profs et configure les classes." },
              { role: "Enseignant", desc: "Publie les devoirs, fait l'appel et communique avec les élèves/parents." },
              { role: "Élève", desc: "Consulte son horaire, participe au chat de classe et suit ses progrès." },
              { role: "Parent", desc: "Surveille la réussite de ses enfants et valide les devoirs par signature numérique." }
            ].map((r, i) => (
              <div key={i} className="card" style={{ textAlign: "center" }}>
                <h3 style={{ color: "var(--primary)" }}>{r.role}</h3>
                <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section Fonctionnement */}
        <section className="card">
          <h2 style={{ marginBottom: "1.5rem" }}>Comment utiliser Scolaris ?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem" }}>1. Connexion Sécurisée</h3>
              <p style={{ opacity: 0.7 }}>Utilisez votre matricule unique. Pour votre sécurité, Scolaris utilise des cookies protégés et vous déconnecte automatiquement après 15 minutes d'inactivité.</p>
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem" }}>2. Mode Hors-ligne</h3>
              <p style={{ opacity: 0.7 }}>Une fois connecté, vos données (horaires, devoirs) sont stockées sur votre téléphone. Vous pouvez les consulter dans le bus ou dans des zones sans réseau.</p>
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem" }}>3. Messagerie & Chat</h3>
              <p style={{ opacity: 0.7 }}>Restez en contact permanent. Les élèves travaillent ensemble dans le chat de classe, tandis que les parents parlent directement aux professeurs.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default GuidePage;
