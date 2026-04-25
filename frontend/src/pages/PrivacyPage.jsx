/**
 * @file PrivacyPage.jsx
 * @description Page détaillant la politique de confidentialité et la protection des données personnelles.
 */

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "clamp(2rem, 8vw, 4rem) 1.5rem", maxWidth: "800px" }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 8vw, 2.5rem)", marginBottom: "1.5rem", fontWeight: "800" }}>Politique de Confidentialité</h1>
        
        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.8rem", fontSize: "1.2rem" }}>1. Collecte des données</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.6", fontSize: "0.95rem" }}>
            Scolaris collecte des informations nécessaires à la gestion pédagogique : noms, prénoms, 
            matricules, résultats scolaires et coordonnées des parents. Ces données sont collectées 
            uniquement dans le cadre du suivi éducatif.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.8rem", fontSize: "1.2rem" }}>2. Utilisation des données</h3>
          <div style={{ opacity: 0.8, lineHeight: "1.6", fontSize: "0.95rem" }}>
            Les données sont utilisées pour :
            <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
              <li>Gérer les dossiers des élèves</li>
              <li>Communiquer les informations officielles</li>
              <li>Permettre le suivi des notes par les parents</li>
              <li>Sécuriser l'accès aux espaces personnels</li>
            </ul>
          </div>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.8rem", fontSize: "1.2rem" }}>3. Protection des données</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.6", fontSize: "0.95rem" }}>
            Nous mettons en œuvre des mesures de sécurité rigoureuses pour protéger vos informations. 
            Les mots de passe sont hachés et les connexions sont cryptées.
          </p>
        </section>

        <section style={{ marginBottom: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
          <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>
            Dernière mise à jour : 23 Avril 2026<br />
            &copy; 2026 Scolaris - Emmanouch KONGO BOLA
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default PrivacyPage;