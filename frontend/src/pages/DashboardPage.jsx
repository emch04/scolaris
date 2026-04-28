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
  const { user, autoResolvedCount, setAutoResolvedCount } = useAuth();
  const [shouldCrash, setShouldCrash] = useState(false);
  
  const [statsData, setStatsData] = useState(() => {
    const cached = localStorage.getItem(`stats_cache_${user?.id}`);
    return cached ? JSON.parse(cached) : null;
  });

  // Simulation de crash capturable par la Boîte Noire
  if (shouldCrash) {
    throw new Error("🔥 TEST CRASH BOÎTE NOIRE : Simulation d'un incident critique par Emch.");
  }
  
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

  // Notification IA Black Box
  useEffect(() => {
    if (autoResolvedCount > 0) {
      const timer = setTimeout(() => {
        setAutoResolvedCount(0);
        sessionStorage.removeItem("ia_stabilized_count");
      }, 15000); // 15 secondes pour bien le voir
      return () => clearTimeout(timer);
    }
  }, [autoResolvedCount, setAutoResolvedCount]);

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
        { label: "Oracle IA", value: "Actif", color: "#00C851", path: "/blackbox", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
        { label: "Parents", value: "Liste", color: "#95a5a6", path: "/parents", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
        { label: "Surveillance", value: "Logs", color: "#ff5252", path: "/logs", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
        { label: "Paramètres", value: "Système", color: "#1A73E8", path: "/system-settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" }
      ];
    }

    if (role === "secretary") {
      return [
        ...base,
        { label: "Ma Caisse", value: `${counts.totalCaisse || 0} $`, color: "#34A853", path: "/treasury", icon: "M12 1v22M17 5H9.5a4.5 4.5 0 1 0 0 9h5a4.5 4.5 0 1 1 0 9H6" },
        { label: "Oracle IA", value: "Analyser", color: "#00C851", path: "/blackbox", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
        { label: "Élèves", value: counts.students || "0", color: "#0066cc", path: "/students", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
        { label: "Classes", value: counts.classrooms || "0", color: "#1abc9c", path: "/classrooms", icon: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" },
        { label: "Parents", value: "Liste", color: "#F9AB00", path: "/parents", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
        { label: "Messages", value: "Ouvrir", color: "#9b59b6", path: "/messages", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }
      ];
    }

    if (["admin", "director", "teacher"].includes(role)) {
       const staff = [...base];
       staff.push({ label: "Mes Élèves", value: counts.students || "0", color: "#0066cc", path: "/students", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" });
       
       if (["admin", "director", "hero_admin", "super_admin", "secretary"].includes(role)) {
         staff.push({ label: "Oracle IA", value: "Analyser", color: "#00C851", path: "/blackbox", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" });
       }

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
      <main className="container dashboard-main">
        
        {/* Notification IA Black Box */}
        {autoResolvedCount > 0 && (
          <div style={{ 
            background: "linear-gradient(to right, #34A853, #1abc9c)", 
            color: "white", 
            padding: "1rem", 
            borderRadius: "16px", 
            marginBottom: "2rem", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "12px",
            animation: "slideDown 0.5s ease-out",
            boxShadow: "0 10px 20px rgba(52, 168, 83, 0.2)"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontWeight: "900", fontSize: "0.9rem" }}>SÉCURITÉ IA : SYSTÈME STABILISÉ</p>
              <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.9 }}>La Boîte Noire a détecté et résolu {autoResolvedCount} incident(s) technique(s) automatiquement.</p>
            </div>
          </div>
        )}

        {/* En-tête */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Tableau de Bord</h1>
          <p className="dashboard-welcome" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            Bienvenue 
            {user?.role === 'hero_admin' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"></path><path d="M19 16v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3"></path></svg>
            )} 
            <strong>{user?.fullName}</strong>
          </p>
          
          <div className="status-container">
            <span className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
              <div className="status-dot"></div>
              {isOnline ? "En ligne" : "Hors-ligne"}
            </span>
          </div>
        </div>

        {/* Grille d'Outils */}
        <div className="tools-grid">
          {stats.map((s, i) => (
            <Link key={i} to={s.path} className="tool-card-link">
              <div className="tool-card" style={{ background: `${s.color}10`, borderColor: `${s.color}30` }}>
                <div className="tool-icon" style={{ background: s.color }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon}></path></svg>
                </div>
                <div className="tool-info">
                  <h4 className="tool-label" style={{ color: s.color }}>{s.label}</h4>
                  <p className="tool-value">{s.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Section Graphique */}
        {["hero_admin", "super_admin", "admin", "director"].includes(user?.role) && statsData && (
          <Link to="/registration-stats" className="chart-section-link">
            <div className="chart-summary-card">
              <div className="chart-card-header">
                <h3 className="chart-card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                  Flux Inscriptions
                </h3>
                <span className="chart-link-text" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  Analyse 
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </div>
              
              <div className="chart-mini-viewport">
                {trendData.length > 0 ? trendData.map((h, i) => (
                  <div key={i} className="chart-mini-col">
                    <div className="chart-mini-bar" style={{ height: `${Math.max((h/Math.max(...trendData, 1))*100, 8)}%`, opacity: 0.4 + (i/24) }}></div>
                    <span className="chart-mini-label">{trendLabels[i]}</span>
                  </div>
                )) : (
                  <p className="chart-loading">Chargement des données...</p>
                )}
              </div>
            </div>
          </Link>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          .dashboard-main { padding: 1.5rem 1rem; text-align: center; }
          .dashboard-header { margin-bottom: 2rem; }
          .dashboard-title { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.5rem; letter-spacing: -0.5px; }
          .dashboard-welcome { opacity: 0.6; font-size: 0.95rem; line-height: 1.4; }
          
          .status-container { display: flex; justify-content: center; gap: 10px; margin-top: 1rem; }
          .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 6px; border: 1px solid transparent; }
          .status-badge.online { background: rgba(52, 168, 83, 0.1); color: #34A853; border-color: rgba(52, 168, 83, 0.2); }
          .status-badge.offline { background: rgba(234, 67, 53, 0.1); color: #EA4335; border-color: rgba(234, 67, 53, 0.2); }
          .status-dot { width: 6px; height: 6px; border-radius: 50%; }
          .online .status-dot { background: #34A853; }
          .offline .status-dot { background: #EA4335; }

          .tools-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; width: 100%; max-width: 1200px; margin: 0 auto 2rem; }
          .tool-card-link { text-decoration: none; color: inherit; }
          .tool-card { 
            padding: 1.2rem 1rem; 
            border-radius: 24px; 
            border: 1px solid rgba(255,255,255,0.05); 
            text-align: left; 
            display: flex; 
            flex-direction: column; 
            gap: 15px; 
            height: 100%;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
          }
          .tool-icon { 
            width: 42px; 
            height: 42px; 
            border-radius: 14px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            box-shadow: 0 6px 15px rgba(0,0,0,0.15);
            transition: transform 0.2s;
          }
          .tool-icon svg {
            width: 22px;
            height: 22px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
          }
          .tool-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; margin: 0; opacity: 0.8; }
          .tool-value { font-size: 1.3rem; font-weight: 900; margin-top: 2px; letter-spacing: -0.5px; }

          .chart-section-link { text-decoration: none; color: inherit; display: block; max-width: 1200px; margin: 0 auto; }
          .chart-summary-card { background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.06); text-align: left; }
          .chart-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
          .chart-card-title { font-size: 0.95rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0; }
          .chart-link-text { font-size: 0.7rem; color: var(--primary); font-weight: 800; }
          
          .chart-mini-viewport { height: 100px; width: 100%; display: flex; align-items: flex-end; gap: 4px; padding-bottom: 5px; }
          .chart-mini-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
          .chart-mini-bar { width: 100%; background: var(--primary); border-radius: 3px 3px 0 0; }
          .chart-mini-label { font-size: 0.45rem; opacity: 0.3; font-weight: 700; margin-top: 4px; }
          .chart-loading { opacity: 0.3; width: 100%; text-align: center; font-size: 0.8rem; }

          @media (min-width: 769px) {
            .dashboard-main { padding-top: 5vh; }
            .dashboard-title { font-size: 2.8rem; }
            .dashboard-welcome { font-size: 1.1rem; }
            .tools-grid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 4rem; }
            .tool-card { padding: 1.8rem; gap: 18px; border-radius: 30px; }
            .tool-icon { width: 52px; height: 52px; border-radius: 16px; }
            .tool-icon svg { width: 26px; height: 26px; }
            .tool-label { font-size: 0.75rem; }
            .tool-value { font-size: 1.6rem; }
            .chart-summary-card { padding: 2rem; border-radius: 30px; }
            .chart-card-title { font-size: 1.2rem; }
            .chart-mini-viewport { height: 180px; gap: 10px; }
            .chart-mini-label { font-size: 0.55rem; }
          }
        `}} />
      </main>
    </>
  );
}

export default DashboardPage;
