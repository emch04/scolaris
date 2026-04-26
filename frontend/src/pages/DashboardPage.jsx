/**
 * @file DashboardPage.jsx
 * @description Version Ultime du Tableau de Bord - Prestige, Graphiques et Liens Corrigés.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import { getGlobalStatsRequest, getTeacherStatsRequest } from "../services/stats.api";

function DashboardPage() {
  const { user } = useAuth();
  
  const [statsData, setStatsData] = useState(() => {
    const cached = localStorage.getItem(`stats_cache_${user?.id}`);
    return cached ? JSON.parse(cached) : null;
  });
  
  const [loading, setLoading] = useState(!statsData);
  const [isOnline, setIsOnline] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    const request = ["hero_admin", "super_admin"].includes(user?.role) ? getGlobalStatsRequest() : getTeacherStatsRequest();
    
    request
      .then(res => {
        if (res?.data) {
          setStatsData(res.data);
          localStorage.setItem(`stats_cache_${user?.id}`, JSON.stringify(res.data));
          setIsOnline(true);
        }
      })
      .catch(() => setIsOnline(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const getStatsConfig = () => {
    const role = user?.role;
    const counts = statsData?.counts || {};
    
    const base = [
      { label: "Communiqués", value: "Voir", color: "#34A853", path: "/communications", icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" },
      { label: "Calendrier", value: "Scolaire", color: "#9b59b6", path: "/calendar", icon: "M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" },
    ];

    if (role === "hero_admin") {
      return [
        ...base,
        { label: "Trésorerie", value: `${counts.totalCaisse || 0} $`, color: "#34A853", path: "/treasury", icon: "M12 1v22M17 5H9.5a4.5 4.5 0 1 0 0 9h5a4.5 4.5 0 1 1 0 9H6" },
        { label: "Écoles", value: counts.schools || "0", color: "#F9AB00", path: "/schools", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
        { label: "Personnel", value: counts.teachers || "0", color: "#0066cc", path: "/teachers", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
        { label: "Classes", value: counts.classrooms || "0", color: "#1abc9c", path: "/classrooms", icon: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" },
        { label: "Élèves", value: counts.students || "0", color: "#e67e22", path: "/students", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
        { label: "Parents", value: "Liste", color: "#95a5a6", path: "/parents", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
        { label: "Surveillance", value: "Logs", color: "#ff5252", path: "/logs", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
        { label: "Paramètres", value: "Système", color: "#1A73E8", path: "/system-settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" }
      ];
    }

    if (role === "secretary") {
      return [
        ...base,
        { label: "Ma Caisse", value: `${counts.totalCaisse || 0} $`, color: "#34A853", path: "/treasury", icon: "M12 1v22M17 5H9.5a4.5 4.5 0 1 0 0 9h5a4.5 4.5 0 1 1 0 9H6" },
        { label: "Élèves", value: counts.students || "0", color: "#0066cc", path: "/students", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
        { label: "Classes", value: counts.classrooms || "0", color: "#1abc9c", path: "/classrooms", icon: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" },
        { label: "Parents", value: "Liste", color: "#F9AB00", path: "/parents", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
        { label: "Messages", value: "Ouvrir", color: "#9b59b6", path: "/messages", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }
      ];
    }

    if (["admin", "director", "teacher"].includes(role)) {
       const staff = [...base];
       staff.push({ label: "Mes Élèves", value: counts.students || "0", color: "#0066cc", path: "/students", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" });
       if (["admin", "director"].includes(role)) {
         staff.push({ label: "Trésorerie", value: `${counts.totalCaisse || 0} $`, color: "#34A853", path: "/treasury", icon: "M12 1v22" });
         staff.push({ label: "Classes", value: counts.classrooms || "0", color: "#1abc9c", path: "/classrooms", icon: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" });
       }
       return staff;
    }

    return base;
  };

  const stats = getStatsConfig();
  const trendData = statsData?.trend?.data || [];
  const trendLabels = statsData?.trend?.labels || [];

  return (
    <>
      <Helmet><title>Tableau de Bord - Scolaris</title></Helmet>
      <Navbar />
      <main className="container" style={{ paddingTop: "5vh", textAlign: "center" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "900", marginBottom: "0.5rem" }}>Tableau de Bord</h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Bienvenue {user?.role === 'hero_admin' ? 'Majesté' : ''}, <strong>{user?.fullName}</strong>. Voici vos outils.</p>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "1rem", alignItems: "center" }}>
            <span style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "0.8rem", background: isOnline ? "rgba(52, 168, 83, 0.1)" : "rgba(234, 67, 53, 0.1)", color: isOnline ? "#34A853" : "#EA4335", border: `1px solid ${isOnline ? "#34A85340" : "#EA433540"}`, display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: isOnline ? "#34A853" : "#EA4335" }}></div>
              {isOnline ? "En ligne" : "Hors-ligne"}
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", width: "100%", maxWidth: "1200px", margin: "0 auto 4rem" }}>
          {stats.map((s, i) => (
            <Link key={i} to={s.path} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: `${s.color}15`, padding: "1.5rem 1rem", borderRadius: "20px", border: `2px solid ${s.color}40`, textAlign: "left", display: "flex", flexDirection: "column", gap: "10px", transition: "all 0.3s ease", cursor: "pointer", height: "100%" }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ background: s.color, color: "white", width: "45px", height: "45px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 10px ${s.color}40` }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon}></path></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", color: s.color }}>{s.label}</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: "900", marginTop: "2px" }}>{s.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {["hero_admin", "super_admin", "admin", "director"].includes(user?.role) && statsData && (
          <Link to="/registration-stats" style={{ width: "100%", maxWidth: "1200px", textDecoration: "none", color: "inherit", display: "block", margin: "0 auto" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "2rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "left", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.01)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                  Flux des Inscriptions (12 derniers mois)
                </h3>
                <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "bold" }}>Analyse détaillée →</span>
              </div>
              
              <div style={{ height: "180px", width: "100%", display: "flex", alignItems: "flex-end", gap: "10px", paddingBottom: "10px" }}>
                {trendData.length > 0 ? trendData.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", height: "100%", justifyContent: "flex-end" }}>
                    <div style={{ width: "100%", height: `${Math.max((h/Math.max(...trendData, 1))*100, 5)}%`, background: "linear-gradient(to top, var(--primary), #4c8bf5)", borderRadius: "4px 4px 0 0", opacity: 0.5 + (i/24) }}></div>
                    <span style={{ fontSize: "0.5rem", opacity: 0.4, fontWeight: "bold", whiteSpace: "nowrap" }}>{trendLabels[i]}</span>
                  </div>
                )) : (
                  <p style={{ opacity: 0.3, width: "100%", textAlign: "center" }}>Chargement des données historiques...</p>
                )}
              </div>
            </div>
          </Link>
        )}
      </main>
    </>
  );
}

export default DashboardPage;
