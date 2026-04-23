import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "4rem 1.5rem", maxWidth: "800px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Politique de Confidentialité</h1>
        
        <section style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>1. Collecte des données</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.7" }}>
            Scolaris collecte des informations nécessaires à la gestion pédagogique : noms, prénoms, 
            matricules, résultats scolaires et coordonnées des parents. Ces données sont collectées 
            uniquement dans le cadre du suivi éducatif.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>2. Utilisation des données</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.7" }}>
            Les données sont utilisées pour :
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li>Gérer les dossiers des élèves</li>
              <li>Communiquer les informations officielles de l'école</li>
              <li>Permettre aux parents de suivre les notes de leurs enfants</li>
              <li>Sécuriser l'accès aux espaces personnels</li>
            </ul>
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>3. Protection des données</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.7" }}>
            Nous mettons en œuvre des mesures de sécurité rigoureuses pour protéger vos informations contre 
            tout accès non autorisé. Les mots de passe sont hachés et les connexions sont sécurisées.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem" }}>
          <p style={{ fontSize: "0.9rem", opacity: 0.6 }}>
            Dernière mise à jour : 23 Avril 2026<br />
            Propriété intellectuelle : &copy; 2026 Emmanouch KONGO BOLA - Développeur Fullstack
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default PrivacyPage;