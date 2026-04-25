/**
 * @file TermsPage.jsx
 * @description Page affichant les conditions générales d'utilisation (CGU) du service.
 */

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "clamp(2rem, 8vw, 4rem) 1.5rem", maxWidth: "800px" }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 8vw, 2.5rem)", marginBottom: "1.5rem", fontWeight: "800" }}>Conditions Générales</h1>
        
        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.8rem", fontSize: "1.2rem" }}>1. Acceptation</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.6", fontSize: "0.95rem" }}>
            L'utilisation de la plateforme Scolaris implique l'acceptation pleine et entière 
            des présentes conditions. Cet outil est destiné exclusivement aux établissements 
            partenaires.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.8rem", fontSize: "1.2rem" }}>2. Propriété</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.6", fontSize: "0.95rem" }}>
            La plateforme (code, design, algorithmes) est la propriété exclusive de 
            <strong> Emmanouch KONGO BOLA</strong>. Toute reproduction ou distribution sans autorisation est strictement interdite.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.8rem", fontSize: "1.2rem" }}>3. Responsabilité</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.6", fontSize: "0.95rem" }}>
            L'utilisateur est responsable de ses identifiants. Toute action effectuée depuis un compte personnel engage son titulaire. 
            L'usage doit rester conforme aux objectifs pédagogiques.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.8rem", fontSize: "1.2rem" }}>4. Service</h3>
          <p style={{ opacity: 0.8, lineHeight: "1.6", fontSize: "0.95rem" }}>
            Scolaris se réserve le droit de modifier ou d'interrompre ses services pour des 
            raisons de maintenance ou d'amélioration technique.
          </p>
        </section>

        <section style={{ marginBottom: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
          <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>
            Contact : legal@scolaris.cd<br />
            Conception & Développement : Emmanouch KONGO BOLA
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default TermsPage;