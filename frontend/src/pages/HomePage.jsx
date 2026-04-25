/**
 * @file HomePage.jsx
 * @description Page d'accueil publique de la plateforme Scolaris.
 */

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function HomePage() {
  const features = [
    {
      title: "Tranquillité d'Esprit",
      desc: "Vos informations sont protégées comme dans un coffre-fort. Personne d'autre que vous et l'école n'y a accès.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      )
    },
    {
      title: "Partout avec Vous",
      desc: "Utilisez Scolaris comme une application sur votre téléphone. Ça marche même sans internet pour consulter vos cours et horaires.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
      )
    },
    {
      title: "Documents Officiels",
      desc: "Obtenez vos bulletins de notes en un clic. Ils sont clairs, professionnels et prêts à être imprimés pour vos dossiers.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      )
    }
  ];

  const stats = [
    { label: "Élèves Inscrits", value: "2,500+" },
    { label: "Cours Partagés", value: "15,000+" },
    { label: "Taux de Réussite", value: "94%" },
    { label: "Parents Connectés", value: "4,000+" }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ 
        minHeight: "90vh", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        padding: "4rem 1.5rem",
        textAlign: "center",
        background: "radial-gradient(circle at center, rgba(50, 20, 152, 0.2) 0%, transparent 70%)"
      }}>
        <div style={{ 
          background: "white", 
          width: "120px", 
          height: "120px", 
          borderRadius: "30px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          marginBottom: "2rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          transform: "rotate(-5deg)"
        }}>
          <img src="/assets/image.jpg" alt="Scolaris Logo" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
        </div>
        
        <h1 style={{ 
          fontSize: "clamp(2.5rem, 8vw, 4.5rem)", 
          fontWeight: "900", 
          lineHeight: "1.1", 
          marginBottom: "1.5rem",
          background: "linear-gradient(to bottom, #ffffff 0%, #a0a0a0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Réinventons ensemble <br /> l'éducation.
        </h1>
        
        <p style={{ 
          fontSize: "1.25rem", 
          opacity: 0.7, 
          maxWidth: "700px", 
          marginBottom: "3rem",
          lineHeight: "1.6"
        }}>
          Scolaris est l'outil indispensable pour une école moderne et connectée, 
          conçu pour accompagner la réussite de chaque élève.
        </p>
        
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: "1.2rem 2.5rem", fontSize: "1.1rem", borderRadius: "15px" }}>
            Espace de connexion
          </Link>
          <Link to="/a-propos" className="btn" style={{ 
            background: "rgba(255,255,255,0.05)", 
            border: "2px solid rgba(255,255,255,0.1)", 
            padding: "1.2rem 2.5rem", 
            fontSize: "1.1rem",
            color: "white",
            borderRadius: "15px"
          }}>
            Découvrir Scolaris
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: "rgba(255,255,255,0.02)", padding: "5rem 0", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", textAlign: "center" }}>
          {stats.map((stat, i) => (
            <div key={i}>
              <h2 style={{ fontSize: "3rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.5rem" }}>{stat.value}</h2>
              <p style={{ opacity: 0.5, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "bold" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container" style={{ padding: "8rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Une solution complète</h2>
          <p style={{ opacity: 0.6 }}>Tout ce dont votre établissement a besoin pour briller au 21ème siècle.</p>
        </div>
        
        <div className="grid">
          {features.map((f, i) => (
            <div key={i} style={{ 
              background: "rgba(255,255,255,0.03)", 
              padding: "3rem 2rem", 
              borderRadius: "30px", 
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "transform 0.3s ease",
              cursor: "default"
            }}
            onMouseOver={e => e.currentTarget.style.transform = "translateY(-10px)"}
            onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ color: "var(--primary)", marginBottom: "1.5rem" }}>{f.icon}</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{f.title}</h3>
              <p style={{ opacity: 0.6, lineHeight: "1.6" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: "8rem 1.5rem", background: "rgba(26, 115, 232, 0.05)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>Notre Mission</h2>
            <p style={{ fontSize: "1.1rem", opacity: 0.7, lineHeight: "1.8", marginBottom: "2rem" }}>
              Scolaris est né d'une idée simple : rendre la vie scolaire plus facile et plus belle pour tout le monde. 
              Nous aidons les parents à suivre leurs enfants sans stress et nous permettons aux professeurs de se concentrer sur le plus important : transmettre le savoir.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {["Transparence totale sur les notes", "Suivi pédagogique personnalisé", "Communication fluide et immédiate"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ 
              width: "100%", 
              aspectRatio: "1", 
              background: "linear-gradient(45deg, var(--primary), #321498)", 
              borderRadius: "40px",
              transform: "rotate(3deg)",
              opacity: 0.2,
              position: "absolute"
            }}></div>
            <img 
              src="/assets/image.jpg" 
              alt="Education" 
              style={{ 
                width: "100%", 
                borderRadius: "40px", 
                boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
                position: "relative",
                zIndex: 1
              }} 
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container" style={{ padding: "10rem 1.5rem", textAlign: "center" }}>
        <div style={{ 
          background: "linear-gradient(135deg, var(--primary) 0%, #004d99 100%)", 
          padding: "5rem 2rem", 
          borderRadius: "40px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.4)"
        }}>
          <h2 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "1.5rem" }}>Prêt à rejoindre Scolaris ?</h2>
          <p style={{ fontSize: "1.2rem", opacity: 0.9, marginBottom: "3rem", maxWidth: "600px", margin: "0 auto 3rem" }}>
            Rejoignez des milliers d'élèves et d'enseignants qui utilisent déjà notre plateforme au quotidien.
          </p>
          <Link to="/login" className="btn" style={{ 
            background: "white", 
            color: "var(--primary)", 
            padding: "1.2rem 3rem", 
            fontSize: "1.1rem", 
            borderRadius: "15px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
          }}>
            Commencer maintenant
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default HomePage;