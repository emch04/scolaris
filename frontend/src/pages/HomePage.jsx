import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function HomePage() {
  const features = [
    {
      title: "Gestion Intelligente",
      desc: "Inscriptions, matricules et dossiers élèves centralisés et sécurisés.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
      )
    },
    {
      title: "Continuité Pédagogique",
      desc: "Diffusion instantanée des devoirs, leçons et supports de cours.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
      )
    },
    {
      title: "Lien École-Famille",
      desc: "Communications, convocations et suivis de notes en temps réel.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
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
          <img src="/assets/image.png" alt="Scolaris Logo" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
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
          Scolaris est la plateforme de gestion scolaire nouvelle génération conçue pour les établissements d'excellence. 
          Un pont numérique entre enseignants, élèves et parents.
        </p>
        
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: "1.2rem 2.5rem", fontSize: "1.1rem", borderRadius: "15px" }}>
            Accéder à mon espace
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
              Nous croyons que la technologie doit être un levier pour l'éducation, pas un obstacle. 
              Scolaris a été créé pour libérer les enseignants des tâches administratives lourdes 
              et permettre aux parents d'être acteurs de la réussite de leurs enfants.
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
              src="/assets/image.png" 
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