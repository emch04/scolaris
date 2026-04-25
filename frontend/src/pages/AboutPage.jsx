/**
 * @file AboutPage.jsx
 * @description Page de présentation "À propos" du projet Scolaris.
 */

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AboutPage() {
  const steps = [
    {
      title: "La Vision",
      desc: "Scolaris est né d'une idée simple : la technologie doit servir l'éducation. Nous voulons offrir à chaque école les outils les plus modernes pour accompagner ses élèves vers l'excellence.",
      year: "Vision"
    },
    {
      title: "L'Innovation",
      desc: "Conçu intégralement par Emmanouch KONGO BOLA, le projet utilise les technologies les plus avancées pour garantir un site léger, rapide et sécurisé comme une banque.",
      year: "Expertise"
    },
    {
      title: "L'Avenir",
      desc: "Aujourd'hui, Scolaris transforme la relation entre l'école et la famille en rendant l'information scolaire accessible partout, tout le temps, même sans connexion internet stable.",
      year: "Avenir"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "clamp(2rem, 8vw, 4rem) 1.5rem" }}>
        
        {/* Section Titre */}
        <section style={{ marginBottom: "clamp(3rem, 10vw, 6rem)", textAlign: "center" }}>
          <h1 style={{ 
            fontSize: "clamp(2rem, 8vw, 4rem)", 
            fontWeight: "900", 
            marginBottom: "1.2rem",
            background: "linear-gradient(to right, #fff, #888)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: "1.1"
          }}>
            L'excellence à portée de clic
          </h1>
          <p style={{ fontSize: "clamp(1rem, 4vw, 1.2rem)", opacity: 0.7, maxWidth: "800px", margin: "0 auto", lineHeight: "1.7" }}>
            Scolaris n'est pas qu'un logiciel de gestion scolaire. C'est un pont numérique qui connecte les directeurs, les professeurs, les parents et les élèves dans un seul écosystème fluide et bienveillant.
          </p>
        </section>

        {/* Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "750px", margin: "0 auto clamp(4rem, 15vw, 8rem)" }}>
          {steps.map((step, i) => (
            <div key={i} style={{ 
              display: "flex", 
              flexDirection: window.innerWidth < 640 ? "column" : "row",
              gap: "1.5rem", 
              alignItems: window.innerWidth < 640 ? "flex-start" : "center",
              background: "rgba(255,255,255,0.02)",
              padding: "1.5rem",
              borderRadius: "25px",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "transform 0.3s ease"
            }}>
              <div style={{ 
                background: "var(--primary)", 
                color: "white", 
                padding: "10px 20px", 
                borderRadius: "12px", 
                fontWeight: "900",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                minWidth: "110px",
                textAlign: "center",
                boxShadow: "0 10px 20px rgba(26, 115, 232, 0.2)"
              }}>
                {step.year}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--primary)", fontWeight: "800" }}>{step.title}</h3>
                <p style={{ opacity: 0.7, lineHeight: "1.6", fontSize: "0.95rem", margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nos 3 Piliers */}
        <section style={{ 
          background: "linear-gradient(135deg, rgba(26, 115, 232, 0.08) 0%, rgba(10,10,10,0.5) 100%)", 
          padding: "clamp(3rem, 10vw, 5rem) 1.5rem", 
          borderRadius: "35px", 
          border: "1px solid rgba(255,255,255,0.08)",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 8vw, 2.5rem)", marginBottom: "clamp(2rem, 8vw, 4rem)", fontWeight: "900" }}>Pourquoi Scolaris ?</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
            {[
              { title: "Fiabilité Totale", desc: "Vos documents sont en sécurité dans le cloud et téléchargeables en PDF.", icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" },
              { title: "Sécurité Maximale", desc: "Protection de la vie privée avec les dernières technologies de cryptage.", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
              { title: "Accessibilité", desc: "Restez connecté sur smartphone, même avec une connexion limitée.", icon: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z M2 12h20" }
            ].map((pillar, i) => (
              <div key={i} style={{ 
                padding: "1.5rem", 
                borderRadius: "20px", 
                background: "rgba(255,255,255,0.02)", 
                border: "1px solid rgba(255,255,255,0.05)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(-5px)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ color: "var(--primary)", marginBottom: "1.2rem" }}>
                  <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={pillar.icon}></path></svg>
                </div>
                <h3 style={{ marginBottom: "0.8rem", fontSize: "1.2rem", fontWeight: "800" }}>{pillar.title}</h3>
                <p style={{ opacity: 0.6, fontSize: "0.9rem", lineHeight: "1.5", margin: 0 }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

export default AboutPage;