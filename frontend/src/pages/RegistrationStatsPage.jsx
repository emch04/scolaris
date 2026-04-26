/**
 * @file RegistrationStatsPage.jsx
 * @description Analyse avancée des inscriptions (Jour/Semaine/Mois) avec filtrage par école.
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import useAuth from "../hooks/useAuth";
import { getGlobalStatsRequest, getTeacherStatsRequest } from "../services/stats.api";
import { getSchoolsRequest } from "../services/school.api";
import { useToast } from "../context/ToastContext";

function RegistrationStatsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [period, setPeriod] = useState("monthly");
  const [selectedSchool, setSelectedSchool] = useState("");
  const { showToast } = useToast();

  const isHero = user?.role === "hero_admin";
  const isNetworkAdmin = ["hero_admin", "super_admin"].includes(user?.role);

  const fetchStats = async () => {
    setFetching(true);
    try {
      const request = isNetworkAdmin 
        ? getGlobalStatsRequest(selectedSchool, period) 
        : getTeacherStatsRequest(period);
      const res = await request;
      setData(res?.data);
    } catch (err) {
      showToast("Erreur lors de la récupération des analyses.", "error");
    } finally {
      setFetching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period, selectedSchool]);

  useEffect(() => {
    if (isHero) {
      getSchoolsRequest(1, 200).then(res => setSchools(res?.data?.schools || []));
    }
  }, [isHero]);

  if (loading) return <><Navbar /><Loader /></>;

  const trend = data?.trend || { data: [], labels: [] };
  const maxVal = Math.max(...trend.data, 1);
  const totalInscriptions = trend.data.reduce((a, b) => a + b, 0);

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "2rem 1.5rem" }}>
        
        {/* En-tête Dynamique */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", fontWeight: "900", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Analyse Stratégique
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>
            Suivi précis de la croissance du réseau
          </p>
        </div>

        {/* Barre de Filtres (Hero Admin) */}
        <div style={{ 
          background: "rgba(255,255,255,0.03)", 
          padding: "1.5rem", 
          borderRadius: "20px", 
          border: "1px solid rgba(255,255,255,0.1)",
          marginBottom: "2rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          alignItems: "center"
        }}>
          {/* Sélecteur d'École (Hero uniquement) */}
          {isHero && (
            <div style={{ flex: "1 1 300px" }}>
              <label style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "8px", display: "block" }}>🎯 École Cible</label>
              <select 
                value={selectedSchool}
                onChange={e => setSelectedSchool(e.target.value)}
                style={{ width: "100%", background: "white", color: "#222", padding: "12px", borderRadius: "12px", border: "none", fontSize: "0.9rem", fontWeight: "bold" }}
              >
                <option value="">Réseau Global (Toutes les écoles)</option>
                {schools.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
              </select>
            </div>
          )}

          {/* Sélecteur de Période */}
          <div style={{ flex: "1 1 300px" }}>
            <label style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "8px", display: "block" }}>⏳ Échelle Temporelle</label>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", padding: "5px", borderRadius: "12px" }}>
              {["daily", "weekly", "monthly"].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderRadius: "8px",
                    background: period === p ? "var(--primary)" : "transparent",
                    color: "white",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "0.3s",
                    textTransform: "capitalize"
                  }}
                >
                  {p === 'daily' ? 'Jour' : p === 'weekly' ? 'Semaine' : 'Mois'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {fetching ? <Loader /> : (
          <>
            {/* Indicateurs Clés */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
              <div style={{ background: "rgba(26, 115, 232, 0.1)", padding: "2rem", borderRadius: "25px", border: "1px solid rgba(26, 115, 232, 0.3)" }}>
                <p style={{ fontSize: "0.8rem", opacity: 0.7, textTransform: "uppercase", fontWeight: "bold" }}>Inscriptions (Période)</p>
                <h2 style={{ fontSize: "3.5rem", margin: "10px 0", color: "#1A73E8", fontWeight: "900" }}>{totalInscriptions}</h2>
                <p style={{ fontSize: "0.9rem", opacity: 0.5 }}>Sur les {trend.data.length} {period === 'daily' ? 'derniers jours' : period === 'weekly' ? 'dernières semaines' : 'derniers mois'}</p>
              </div>
              <div style={{ background: "rgba(52, 168, 83, 0.1)", padding: "2rem", borderRadius: "25px", border: "1px solid rgba(52, 168, 83, 0.3)" }}>
                <p style={{ fontSize: "0.8rem", opacity: 0.7, textTransform: "uppercase", fontWeight: "bold" }}>Pic d'Activité</p>
                <h2 style={{ fontSize: "3.5rem", margin: "10px 0", color: "#34A853", fontWeight: "900" }}>{maxVal}</h2>
                <p style={{ fontSize: "0.9rem", opacity: 0.5 }}>Inscriptions max atteintes</p>
              </div>
            </div>

            {/* Graphique Grande Échelle */}
            <div style={{ background: "rgba(255,255,255,0.02)", padding: "2rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "3rem", overflowX: "auto" }}>
              <h3 style={{ marginBottom: "2.5rem", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--primary)" }}></div>
                Courbe de croissance {selectedSchool ? "(École sélectionnée)" : "(Réseau)"}
              </h3>
              
              <div style={{ height: "400px", minWidth: "800px", display: "flex", alignItems: "flex-end", gap: "8px", paddingBottom: "40px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                {trend.data.map((val, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", height: "100%", justifyContent: "flex-end" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: "bold", opacity: val > 0 ? 0.9 : 0.2 }}>{val}</div>
                    <div 
                      style={{ 
                        width: "100%", 
                        height: `${(val / maxVal) * 100}%`, 
                        minHeight: val > 0 ? "5px" : "0px",
                        background: val === maxVal ? "var(--primary)" : "linear-gradient(to top, rgba(26, 115, 232, 0.2), rgba(26, 115, 232, 0.8))", 
                        borderRadius: "6px 6px 0 0",
                        transition: "all 0.5s ease-out"
                      }}
                    ></div>
                    <span style={{ fontSize: "0.55rem", opacity: 0.4, transform: "rotate(-45deg)", whiteSpace: "nowrap", marginTop: "12px", width: "10px" }}>{trend.labels[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tableau Récapitulatif */}
            <div style={{ background: "rgba(255,255,255,0.01)", borderRadius: "25px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th style={{ padding: "1.2rem", fontSize: "0.9rem" }}>Période</th>
                    <th style={{ padding: "1.2rem", textAlign: "right", fontSize: "0.9rem" }}>Nbr Inscriptions</th>
                    <th style={{ padding: "1.2rem", textAlign: "right", fontSize: "0.9rem" }}>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {trend.labels.map((label, i) => (
                    <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td style={{ padding: "1rem", opacity: 0.8 }}>{label}</td>
                      <td style={{ padding: "1rem", textAlign: "right", fontWeight: "900" }}>{trend.data[i]}</td>
                      <td style={{ padding: "1rem", textAlign: "right" }}>
                        <span style={{ 
                          padding: "4px 10px", 
                          borderRadius: "50px", 
                          fontSize: "0.7rem", 
                          background: trend.data[i] > 0 ? "rgba(52, 168, 83, 0.15)" : "rgba(255,255,255,0.05)",
                          color: trend.data[i] > 0 ? "#34A853" : "#666",
                          fontWeight: "bold"
                        }}>
                          {trend.data[i] > 0 ? 'Actif' : 'Néant'}
                        </span>
                      </td>
                    </tr>
                  )).reverse()}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default RegistrationStatsPage;
