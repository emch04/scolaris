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
      <main className="container stats-main-container">
        
        {/* En-tête Dynamique */}
        <div className="stats-header">
          <h1 className="stats-title">Analyse Stratégique</h1>
          <p className="stats-subtitle">Croissance du réseau en temps réel</p>
        </div>

        {/* Barre de Filtres */}
        <div className="filter-bar">
          {/* Sélecteur d'École (Hero uniquement) */}
          {isHero && (
            <div className="filter-item">
              <label className="filter-label">École Cible</label>
              <select 
                value={selectedSchool}
                onChange={e => setSelectedSchool(e.target.value)}
                className="filter-select"
              >
                <option value="">Réseau Global</option>
                {schools.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          )}

          {/* Sélecteur de Période */}
          <div className="filter-item">
            <label className="filter-label">Échelle Temporelle</label>
            <div className="period-toggle">
              {["daily", "weekly", "monthly"].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`period-btn ${period === p ? 'active' : ''}`}
                >
                  {p === 'daily' ? 'Jour' : p === 'weekly' ? 'Sem.' : 'Mois'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {fetching ? <Loader /> : (
          <>
            {/* Indicateurs Clés */}
            <div className="indicators-grid">
              <div className="indicator-card blue">
                <p className="indicator-label">Total Inscriptions</p>
                <h2 className="indicator-value">{totalInscriptions}</h2>
                <div className="indicator-badge">Période actuelle</div>
              </div>
              <div className="indicator-card green">
                <p className="indicator-label">Record d'Activité</p>
                <h2 className="indicator-value">{maxVal}</h2>
                <div className="indicator-badge">Pic atteint</div>
              </div>
            </div>

            {/* Graphique Grande Échelle */}
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-dot"></div>
                <h3 className="chart-title">Évolution du flux</h3>
              </div>
...
            <style dangerouslySetInnerHTML={{ __html: `
              .stats-main-container { padding: 1.5rem 1rem; max-width: 1200px; margin: 0 auto; }
              .stats-header { text-align: center; margin-bottom: 2rem; }
              .stats-title { 
                font-size: clamp(1.5rem, 7vw, 2.5rem); 
                font-weight: 900; 
                letter-spacing: -0.5px;
                margin-bottom: 0.5rem;
                background: linear-gradient(135deg, #fff 0%, #aaa 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              .stats-subtitle { 
                opacity: 0.5; 
                font-size: 0.9rem; 
                font-weight: 500;
                letter-spacing: 0.2px;
              }

              .filter-bar { 
                background: rgba(255,255,255,0.02); 
                padding: 1.2rem; 
                border-radius: 24px; 
                border: 1px solid rgba(255,255,255,0.08);
                margin-bottom: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.2rem;
              }
              .filter-label { 
                font-size: 0.65rem; 
                opacity: 0.4; 
                margin-bottom: 8px; 
                display: block; 
                text-transform: uppercase; 
                letter-spacing: 1.5px;
                font-weight: 700;
              }
              .filter-select { 
                width: 100%; 
                background: #fff; 
                color: #000; 
                padding: 14px; 
                border-radius: 16px; 
                border: none; 
                font-size: 0.95rem; 
                font-weight: 700;
                appearance: none;
              }
              
              .period-toggle { display: flex; background: rgba(255,255,255,0.05); padding: 5px; border-radius: 14px; }
              .period-btn { 
                flex: 1; 
                padding: 12px 5px; 
                border: none; 
                border-radius: 10px; 
                background: transparent; 
                color: rgba(255,255,255,0.6); 
                font-size: 0.8rem; 
                font-weight: 700; 
                cursor: pointer; 
                transition: 0.2s; 
              }
              .period-btn.active { background: #fff; color: #000; }

              .indicators-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1.5rem; }
              .indicator-card { padding: 1.2rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); position: relative; overflow: hidden; }
              .indicator-card.blue { background: linear-gradient(135deg, rgba(26, 115, 232, 0.1) 0%, rgba(26, 115, 232, 0.02) 100%); }
              .indicator-card.green { background: linear-gradient(135deg, rgba(52, 168, 83, 0.1) 0%, rgba(52, 168, 83, 0.02) 100%); }
              
              .indicator-label { 
                font-size: 0.6rem; 
                opacity: 0.6; 
                text-transform: uppercase; 
                font-weight: 800; 
                letter-spacing: 0.5px;
                margin: 0 0 4px 0;
              }
              .indicator-value { 
                font-size: 2rem; 
                margin: 0; 
                font-weight: 900; 
                letter-spacing: -1px;
              }
              .indicator-card.blue .indicator-value { color: #4285F4; }
              .indicator-card.green .indicator-value { color: #34A853; }
              
              .indicator-badge { 
                font-size: 0.55rem; 
                font-weight: 700; 
                opacity: 0.3; 
                margin-top: 4px;
              }

              .chart-container { background: rgba(255,255,255,0.01); padding: 1.5rem 1rem; border-radius: 28px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem; }
              .chart-header { display: flex; align-items: center; gap: 8px; margin-bottom: 1.5rem; }
              .chart-title { font-size: 0.9rem; font-weight: 700; margin: 0; opacity: 0.8; }
              .chart-dot { width: 6px; height: 6px; border-radius: 50%; background: #4285F4; box-shadow: 0 0 10px rgba(66, 145, 244, 0.5); }
              
              .chart-scroll { overflow-x: auto; padding-bottom: 15px; scrollbar-width: none; -ms-overflow-style: none; }
              .chart-scroll::-webkit-scrollbar { display: none; }
              
              .chart-viewport { height: 180px; display: flex; align-items: flex-end; gap: 10px; padding: 0 5px; }
              .chart-column { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; position: relative; }
              .chart-val { font-size: 0.65rem; font-weight: 800; opacity: 0; margin-bottom: 6px; color: #fff; }
              .chart-val.visible { opacity: 0.8; }
              .chart-bar { width: 100%; min-height: 4px; background: rgba(255,255,255,0.05); border-radius: 6px 6px 2px 2px; transition: height 0.6s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
              .chart-column:hover .chart-bar { background: #4285F4; }
              .chart-label { font-size: 0.55rem; opacity: 0.25; font-weight: 600; transform: rotate(-45deg); white-space: nowrap; margin-top: 18px; width: 12px; text-align: center; }

              .stats-table-container { background: rgba(255,255,255,0.01); border-radius: 24px; border: 1px solid rgba(255,255,255,0.04); overflow: hidden; }
              .table-header { padding: 1.5rem; font-size: 0.95rem; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.05); opacity: 0.9; }

              @media (min-width: 769px) {
                .stats-main-container { padding: 3rem 2rem; }
                .filter-bar { flex-direction: row; padding: 1.5rem; gap: 2rem; }
                .filter-item { flex: 1; }
                .indicators-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
                .indicator-card { padding: 2.5rem; }
                .indicator-value { font-size: 4rem; }
                .indicator-label { font-size: 0.8rem; }
                .chart-container { padding: 2.5rem; }
                .chart-viewport { height: 350px; gap: 12px; }
                .chart-title { font-size: 1.1rem; }
                .chart-label { font-size: 0.65rem; }
              }
            `}} />
              
              {/* Version Bureau : Tableau */}
              <div className="desktop-only">
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                      <th style={{ padding: "1.2rem", fontSize: "0.85rem", opacity: 0.6 }}>Période</th>
                      <th style={{ padding: "1.2rem", textAlign: "right", fontSize: "0.85rem", opacity: 0.6 }}>Inscriptions</th>
                      <th style={{ padding: "1.2rem", textAlign: "right", fontSize: "0.85rem", opacity: 0.6 }}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trend.labels.map((label, i) => (
                      <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding: "1rem", fontWeight: "500" }}>{label}</td>
                        <td style={{ padding: "1rem", textAlign: "right", fontWeight: "900", color: trend.data[i] > 0 ? "var(--primary)" : "inherit" }}>{trend.data[i]}</td>
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

              {/* Version Mobile : Cards */}
              <div className="mobile-only" style={{ padding: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {trend.labels.map((label, i) => (
                    <div key={i} style={{ 
                      background: "rgba(255,255,255,0.03)", 
                      padding: "1rem", 
                      borderRadius: "16px", 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      border: "1px solid rgba(255,255,255,0.05)"
                    }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.5, marginBottom: "4px" }}>Période</div>
                        <div style={{ fontWeight: "bold" }}>{label}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.75rem", opacity: 0.5, marginBottom: "4px" }}>Inscriptions</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "900", color: trend.data[i] > 0 ? "var(--primary)" : "inherit" }}>
                          {trend.data[i]}
                        </div>
                      </div>
                    </div>
                  )).reverse()}
                </div>
              </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
              .stats-table-container {
                background: rgba(255,255,255,0.01);
                border-radius: 25px;
                border: 1px solid rgba(255,255,255,0.05);
                overflow: hidden;
                margin-bottom: 2rem;
              }
              .mobile-only { display: none; }
              @media (max-width: 768px) {
                .desktop-only { display: none; }
                .mobile-only { display: block; }
              }
            `}} />
          </>
        )}
      </main>
    </>
  );
}

export default RegistrationStatsPage;
