/**
 * @file DashboardPage.jsx
 * @description Tableau de bord principal offrant une vue d'ensemble selon le rôle de l'utilisateur.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import { getGlobalStatsRequest, getTeacherStatsRequest } from "../services/stats.api";

/**
 * DashboardPage.jsx
 * Rôle : Portail principal de l'utilisateur après connexion.
 * Affiche des statistiques et des raccourcis de navigation adaptés au rôle.
 * Intègre une gestion de cache local pour un fonctionnement en mode PWA/Hors-ligne.
 */
function DashboardPage() {
  const { user } = useAuth();
  
  // Initialisation des stats depuis le localStorage pour un affichage immédiat (optimiste)
  const [statsData, setStatsData] = useState(() => {
    const cached = localStorage.getItem(`stats_cache_${user?.id}`);
    return cached ? JSON.parse(cached) : null;
  });
  
  const [loading, setLoading] = useState(!statsData);
  const [isOnline, setIsOnline] = useState(true); // Par défaut on assume en ligne
  const [fetchError, setFetchError] = useState(null);

  /**
   * fetchStats
   * Logique : Récupère les statistiques depuis l'API selon le rôle.
   */
  const fetchStats = () => {
    setLoading(true);
    const request = user?.role === "super_admin" ? getGlobalStatsRequest() : getTeacherStatsRequest();
    
    request
      .then(res => {
        if (res?.data) {
          setStatsData(res.data);
          localStorage.setItem(`stats_cache_${user?.id}`, JSON.stringify(res.data));
          setFetchError(null);
          setIsOnline(true); // Succès = En ligne
        }
      })
      .catch(err => {
        console.error("Erreur stats:", err);
        // Si on a une erreur de connexion (pas de réponse du serveur)
        if (!err.response) {
          setIsOnline(false);
        }
        if (!statsData) {
          setFetchError("Connexion impossible au serveur");
        }
      })
      .finally(() => setLoading(false));
  };

  /**
   * useEffect : Cycle de vie du tableau de bord.
   * - Déclenche le premier chargement des données.
   * - Met en place un polling (toutes les 30s) pour garder les chiffres à jour.
   * - Gère les événements système de connectivité (online/offline).
   */
  useEffect(() => {
    fetchStats();
    
    // On ne se fie plus aux événements window.online/offline qui sont instables
    const interval = setInterval(fetchStats, 30000); // Polling toutes les 30 secondes
    
    return () => {
      clearInterval(interval);
    };
  }, [user]);

  /**
   * getStatsConfig
   * Logique : Définit dynamiquement les cartes affichées (libellé, icône, couleur, lien) 
   * en fonction des permissions du rôle de l'utilisateur.
   */
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
      <Helmet>
        <title>Tableau de Bord - Scolaris</title>
      </Helmet>
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
          
          {fetchError && (
            <p style={{ color: "#EA4335", fontSize: "0.9rem", marginTop: "10px" }}>
              ⚠️ {fetchError}
            </p>
          )}
          
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
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "white",
                cursor: "pointer",
                padding: "8px 18px",
                borderRadius: "14px",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.2s ease",
                opacity: isOnline ? 1 : 0.5,
                fontWeight: "600"
              }}
              onMouseOver={e => !loading && (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
              onMouseOut={e => !loading && (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ 
                  animation: loading ? "spin 1s linear infinite" : "none",
                }}
              >
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              {loading ? "" : "Actualiser"}
              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
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
                padding: "1.5rem 1rem", 
                borderRadius: "20px", 
                border: `2px solid ${s.color}40`,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                transition: "all 0.3s ease",
                cursor: "pointer",
                height: "100%"
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = `${s.color}25`;
                e.currentTarget.style.transform = "translateY(-5px)";
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
                  borderRadius: "10px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  boxShadow: `0 4px 10px ${s.color}40`
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon}></path>
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", color: s.color }}>{s.label}</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: "900", marginTop: "2px" }}>{s.value}</p>
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
