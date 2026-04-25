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
      <main className="container" style={{ padding: "4rem 1.5rem" }}>
        
        {/* Section Titre */}
        <section style={{ marginBottom: "6rem", textAlign: "center" }}>
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 6vw, 4rem)", 
            fontWeight: "900", 
            marginBottom: "1.5rem",
            background: "linear-gradient(to right, #fff, #888)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            L'excellence à portée de clic
          </h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.7, maxWidth: "800px", margin: "0 auto", lineHeight: "1.8" }}>
            Scolaris n'est pas qu'un logiciel de gestion scolaire. C'est un pont numérique qui connecte les directeurs, les professeurs, les parents et les élèves dans un seul écosystème fluide et bienveillant.
          </p>
        </section>

        {/* Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4rem", maxWidth: "800px", margin: "0 auto 8rem" }}>
          {steps.map((step, i) => (
            <div key={i} style={{ 
              display: "flex", 
              gap: "2rem", 
              alignItems: "center",
              background: "rgba(255,255,255,0.02)",
              padding: "2rem",
              borderRadius: "30px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div style={{ 
                background: "var(--primary)", 
                color: "white", 
                padding: "12px 24px", 
                borderRadius: "15px", 
                fontWeight: "900",
                fontSize: "1rem",
                textTransform: "uppercase",
                minWidth: "120px",
                textAlign: "center"
              }}>
                {step.year}
              </div>
              <div>
                <h3 style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--primary)" }}>{step.title}</h3>
                <p style={{ opacity: 0.7, lineHeight: "1.7", fontSize: "1.05rem" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nos 3 Piliers */}
        <section style={{ 
          background: "linear-gradient(135deg, rgba(26, 115, 232, 0.1) 0%, transparent 100%)", 
          padding: "6rem 2rem", 
          borderRadius: "50px", 
          border: "1px solid rgba(255,255,255,0.08)",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "4rem" }}>Pourquoi choisir Scolaris ?</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem" }}>
            <div style={{ padding: "1rem" }}>
              <div style={{ color: "var(--primary)", marginBottom: "1.5rem" }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </div>
              <h3 style={{ marginBottom: "1rem" }}>Fiabilité Totale</h3>
              <p style={{ opacity: 0.6 }}>Vos documents (bulletins, horaires) sont toujours en sécurité dans le cloud et téléchargeables en PDF professionnel.</p>
            </div>
            
            <div style={{ padding: "1rem" }}>
              <div style={{ color: "var(--primary)", marginBottom: "1.5rem" }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 style={{ marginBottom: "1rem" }}>Sécurité Maximale</h3>
              <p style={{ opacity: 0.6 }}>Nous utilisons les mêmes technologies que les banques pour protéger la vie privée de vos élèves et de vos enfants.</p>
            </div>

            <div style={{ padding: "1rem" }}>
              <div style={{ color: "var(--primary)", marginBottom: "1.5rem" }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <h3 style={{ marginBottom: "1rem" }}>Accessibilité</h3>
              <p style={{ opacity: 0.6 }}>Installez l'app sur votre smartphone et restez connecté à votre école, même sans internet stable.</p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

export default AboutPage;