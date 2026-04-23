import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getAssignmentsRequest } from "../services/assignment.api";
import formatDate from "../utils/formatDate";
import useAuth from "../hooks/useAuth";

function ViewDevoirPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const params = {};
        if (user?.role === "student" && user.classroom) {
          params.classroom = user.classroom;
        }
        
        const res = await getAssignmentsRequest(params);
        let list = res?.data || [];

        // Si c'est un parent, on pourrait vouloir filtrer davantage côté front 
        // si le back ne le fait pas encore parfaitement pour les parents multi-enfants
        // Mais pour l'instant, on fait confiance au back ou on affiche tout ce qui est retourné
        
        setAssignments(list);
      } catch (err) {
        setError("Erreur lors du chargement des devoirs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAssignments();
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Espace Devoirs
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Consultez les travaux et validez le suivi pédagogique</p>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div style={{ textAlign: "center", padding: "3rem", opacity: 0.5 }}>{error}</div>
        ) : (
          <div className="grid">
            {assignments.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <p style={{ opacity: 0.5 }}>Aucun devoir n'est disponible pour le moment.</p>
              </div>
            ) : (
              assignments.map(a => (
                <Link key={a._id} to={`/assignment/${a._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ 
                    background: "transparent", 
                    padding: "1.8rem", 
                    borderRadius: "20px", 
                    border: "3px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                      <span style={{ 
                        fontSize: "0.65rem", 
                        padding: "4px 10px", 
                        borderRadius: "50px", 
                        background: "rgba(26, 115, 232, 0.15)", 
                        color: "var(--primary)", 
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        {a.subject}
                      </span>
                      <span style={{ fontSize: "0.7rem", opacity: 0.4 }}>{formatDate(a.createdAt)}</span>
                    </div>

                    <h3 style={{ marginBottom: "0.8rem", fontSize: "1.3rem", fontWeight: "700" }}>{a.title}</h3>
                    
                    <p style={{ fontSize: "0.9rem", opacity: 0.6, lineHeight: "1.5", marginBottom: "2rem", flex: 1 }}>
                      {a.description.length > 120 ? a.description.substring(0, 120) + "..." : a.description}
                    </p>

                    <div style={{ 
                      marginTop: "auto", 
                      paddingTop: "1.2rem", 
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", opacity: 0.5 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        {a.classroom?.name || "Classe"}
                      </div>
                      
                      <div style={{ 
                        color: "var(--primary)", 
                        fontSize: "0.8rem", 
                        fontWeight: "bold", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "6px" 
                      }}>
                        {user?.role === "parent" ? "Valider / Signer" : "Accéder au devoir"}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default ViewDevoirPage;
