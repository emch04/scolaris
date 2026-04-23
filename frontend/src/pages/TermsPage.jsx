import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "4rem 1.5rem", maxWidth: "800px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Conditions Générales d'Utilisation</h1>
        
        <section style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>1. Acceptation des conditions</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.7" }}>
            L'accès et l'utilisation de la plateforme Scolaris impliquent l'acceptation pleine et entière 
            des présentes conditions. Scolaris est un outil de gestion scolaire destiné aux établissements 
            partenaires.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>2. Propriété Intellectuelle</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.7" }}>
            L'ensemble de la plateforme (code source, design, logos, algorithmes) est la propriété exclusive de 
            <strong> Emmanouch KONGO BOLA (Développeur Fullstack)</strong>. Toute reproduction, modification 
            ou distribution sans autorisation préalable est strictement interdite.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>3. Responsabilité de l'utilisateur</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.7" }}>
            L'utilisateur est responsable de la confidentialité de ses identifiants de connexion. 
            Toute action effectuée depuis un compte personnel est sous la responsabilité de son titulaire. 
            L'usage de la plateforme doit rester strictement conforme aux objectifs pédagogiques de l'établissement.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>4. Modification du service</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.7" }}>
            Scolaris se réserve le droit de modifier ou d'interrompre temporairement ses services pour des 
            raisons de maintenance ou d'amélioration technique.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem" }}>
          <p style={{ fontSize: "0.9rem", opacity: 0.6 }}>
            Contact juridique : legal@scolaris.cd<br />
            Conception & Développement : Emmanouch KONGO BOLA
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default TermsPage;