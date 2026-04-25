import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import { getGlobalStatsRequest, getTeacherStatsRequest } from "../services/stats.api";

function DashboardPage() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const fetchStats = () => {
    setLoading(true);
    if (user?.role === "super_admin") {
      getGlobalStatsRequest()
        .then(res => setStatsData(res?.data))
        .catch(err => console.error("Erreur stats:", err))
        .finally(() => setLoading(false));
    } else if (["admin", "director", "teacher"].includes(user?.role)) {
      getTeacherStatsRequest()
        .then(res => setStatsData(res?.data))
        .catch(err => console.error("Erreur stats enseignant:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Augmenté à 30 secondes pour économiser la batterie en PWA
    return () => clearInterval(interval);
  }, [user]);

  // ... (reste du code identique jusqu'au return)

  const getStatsConfig = () => {
    const role = user?.role;
    const base = [
      { label: "Communiqués", value: "Voir", color: "#34A853", path: "/communications", icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" },
      { label: "Calendrier", value: "Scolaire", color: "#9b59b6", path: "/calendar", icon: "M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" },
    ];

    if (role === "super_admin") {
      return [
        ...base,
        { label: "Enseignants", value: statsData?.counts?.teachers || "0", color: "#0066cc", path: "/teachers", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
        { label: "Classes Réseau", value: statsData?.counts?.classrooms || "0", color: "#1abc9c", path: "/classrooms", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
        { label: "Écoles", value: statsData?.counts?.schools || "0", color: "#F9AB00", path: "/schools", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
        { label: "Contacts Réseau", value: "Annuaire", color: "#e67e22", path: "/network-contacts", icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }
      ];
    }

    if (["admin", "director", "teacher"].includes(role)) {
      const teacherCards = [
        ...base,
        { label: "Moyenne Classe", value: statsData?.average !== undefined ? `${statsData.average}/20` : "0/20", color: "#1A73E8", path: "/students", icon: "M12 20v-6M6 20V10M18 20V4" },
        { label: "Taux Réussite", value: statsData?.successRate !== undefined ? `${statsData.successRate}%` : "0%", color: "#34A853", path: "/students", icon: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" },
        { label: "Mes Élèves", value: "Liste", color: "#0066cc", path: "/students", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
        { label: "Plan de Cours", value: "Annuel", color: "#e67e22", path: "/course-plans", icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
        { label: "Bibliothèque", value: "Ouvrir", color: "#F9AB00", path: "/library", icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" }
      ];

      // Seuls les admins et directeurs voient "Mes Classes"
      if (["admin", "director"].includes(role)) {
        teacherCards.splice(1, 0, { label: "Mes Classes", value: "Gérer", color: "#1abc9c", path: "/classrooms", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" });
      }

      return teacherCards;
    }

    return base;
  };

  const stats = getStatsConfig();
  const trendData = statsData?.trend?.data || [40, 65, 45, 90, 75, 120, 100];
  const trendLabels = statsData?.trend?.labels || ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"];

  return (
    <>
      <Navbar />
      <main className="container" style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "flex-start",
        paddingTop: "5vh",
        minHeight: "80vh",
        textAlign: "center" 
      }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "900", marginBottom: "0.5rem" }}>Tableau de Bord</h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Bienvenue, <strong>{user?.fullName}</strong>. Voici vos outils de gestion.</p>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "10px", 
            marginTop: "1rem",
            alignItems: "center"
          }}>
            <span style={{ 
              padding: "5px 12px", 
              borderRadius: "20px", 
              fontSize: "0.8rem", 
              background: isOnline ? "rgba(52, 168, 83, 0.1)" : "rgba(234, 67, 53, 0.1)",
              color: isOnline ? "#34A853" : "#EA4335",
              border: `1px solid ${isOnline ? "#34A85340" : "#EA433540"}`,
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: isOnline ? "#34A853" : "#EA4335" }}></div>
              {isOnline ? "En ligne" : "Hors-ligne (Données en cache)"}
            </span>

            <button 
              onClick={fetchStats}
              disabled={loading || !isOnline}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--primary)",
                cursor: "pointer",
                fontSize: "0.8rem",
                textDecoration: "underline",
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? "Mise à jour..." : "Actualiser"}
            </button>
          </div>
        </div>

        {/* Section Cartes de Couleur */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
          gap: "1.5rem", 
          width: "100%", 
          maxWidth: "1200px",
          marginBottom: "4rem"
        }}>
          {stats.map((s, i) => (
            <Link key={i} to={s.path} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ 
                background: `${s.color}15`, 
                padding: "2rem 1.5rem", 
                borderRadius: "25px", 
                border: `2px solid ${s.color}40`,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                transition: "all 0.3s ease",
                cursor: "pointer",
                height: "100%"
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = `${s.color}25`;
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = `${s.color}15`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
              >
                <div style={{ 
                  background: s.color, 
                  color: "white", 
                  width: "45px", 
                  height: "45px", 
                  borderRadius: "14px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  boxShadow: `0 5px 15px ${s.color}40`
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon}></path>
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", color: s.color }}>{s.label}</h4>
                  <p style={{ fontSize: "1.8rem", fontWeight: "900", marginTop: "5px" }}>{s.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Graphique de Tendance (Super Admin uniquement) */}
        {user?.role === "super_admin" && statsData && (
          <div style={{ 
            width: "100%", 
            maxWidth: "1200px", 
            background: "rgba(255,255,255,0.03)", 
            padding: "2rem", 
            borderRadius: "30px", 
            border: "1px solid rgba(255,255,255,0.08)",
            textAlign: "left"
          }}>
            <h3 style={{ marginBottom: "2rem", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              Inscriptions Réseau (6 derniers mois)
            </h3>
            <div style={{ height: "150px", width: "100%", display: "flex", alignItems: "flex-end", gap: "15px", paddingBottom: "10px" }}>
              {trendData.map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <div style={{ 
                    width: "100%", 
                    height: `${(h/Math.max(...trendData,1))*100}%`, 
                    background: "var(--primary)", 
                    borderRadius: "6px", 
                    opacity: 0.3 + (i/10),
                    minHeight: "5px"
                  }}></div>
                  <span style={{ fontSize: "0.7rem", opacity: 0.4 }}>{trendLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default DashboardPage;
