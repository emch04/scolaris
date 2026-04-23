import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AboutPage() {
  const steps = [
    {
      title: "Genèse du Projet",
      desc: "Scolaris est né d'une volonté de moderniser le système éducatif en RDC, en offrant aux écoles des quartiers populaires un accès aux mêmes outils de gestion que les grandes institutions internationales.",
      year: "2024"
    },
    {
      title: "Développement Fullstack",
      desc: "Conçu intégralement par Emmanouch KONGO BOLA, le projet utilise les technologies les plus robustes (MERN Stack) pour garantir sécurité, rapidité et fiabilité.",
      year: "2025"
    },
    {
      title: "Expansion Nationale",
      desc: "Aujourd'hui, Scolaris accompagne des dizaines d'écoles dans leur transition numérique, facilitant le quotidien de milliers d'élèves et parents.",
      year: "2026"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "4rem 1.5rem" }}>
        
        {/* Section Histoire */}
        <section style={{ marginBottom: "6rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "1.5rem" }}>L'Histoire de Scolaris</h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.7, maxWidth: "800px", margin: "0 auto", lineHeight: "1.8" }}>
            Plus qu'une simple plateforme, Scolaris est une vision pour l'avenir de la jeunesse. 
            Découvrez comment nous transformons l'éducation, un matricule à la fois.
          </p>
        </section>

        {/* Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem", maxWidth: "800px", margin: "0 auto 8rem" }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
              <div style={{ 
                background: "var(--primary)", 
                color: "white", 
                padding: "10px 20px", 
                borderRadius: "10px", 
                fontWeight: "900",
                fontSize: "1.2rem"
              }}>
                {step.year}
              </div>
              <div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{step.title}</h3>
                <p style={{ opacity: 0.6, lineHeight: "1.6" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Guide d'utilisation rapide */}
        <section style={{ 
          background: "rgba(255,255,255,0.03)", 
          padding: "5rem 2rem", 
          borderRadius: "40px", 
          border: "1px solid rgba(255,255,255,0.05)" 
        }}>
          <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "4rem" }}>Comment utiliser Scolaris ?</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "3rem" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", background: "var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.5rem", fontWeight: "bold" }}>1</div>
              <h4>Inscription de l'école</h4>
              <p style={{ opacity: 0.5, fontSize: "0.9rem", marginTop: "0.5rem" }}>L'administration inscrit l'établissement et attend la validation du Super Admin.</p>
            </div>
            
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", background: "var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.5rem", fontWeight: "bold" }}>2</div>
              <h4>Gestion des Élèves</h4>
              <p style={{ opacity: 0.5, fontSize: "0.9rem", marginTop: "0.5rem" }}>Création des classes et génération automatique des matricules uniques pour chaque élève.</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", background: "var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.5rem", fontWeight: "bold" }}>3</div>
              <h4>Suivi au Quotidien</h4>
              <p style={{ opacity: 0.5, fontSize: "0.9rem", marginTop: "0.5rem" }}>Publication des devoirs par les profs et signature numérique par SMS pour les parents.</p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

export default AboutPage;