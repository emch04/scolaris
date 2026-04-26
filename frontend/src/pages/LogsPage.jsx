/**
 * @file LogsPage.jsx
 * @description Page de surveillance technique affichant les derniers crashs capturés par la boîte noire.
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getLogsRequest, clearLogsRequest } from "../services/log.api";
import { useToast } from "../context/ToastContext";
import formatDate from "../utils/formatDate";

function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchLogs = async () => {
    try {
      const res = await getLogsRequest();
      setLogs(res?.data || []);
    } catch (err) {
      showToast("Impossible de charger les logs.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClear = async () => {
    if (!window.confirm("Voulez-vous vraiment vider tout le journal d'incidents ?")) return;
    try {
      await clearLogsRequest();
      setLogs([]);
      showToast("Journal vidé.");
    } catch (err) {
      showToast("Erreur lors de l'opération.", "error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "2rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#ff5252" }}>
            🛡️ Surveillance Système
          </h1>
          <p style={{ opacity: 0.6 }}>Journal technique des incidents et crashs (Boîte Noire)</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.3rem" }}>Derniers Incidents ({logs.length})</h2>
          {logs.length > 0 && (
            <button onClick={handleClear} className="btn btn-danger" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>
              VIDER LE JOURNAL
            </button>
          )}
        </div>

        {loading ? <Loader /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {logs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", background: "rgba(52, 168, 83, 0.05)", borderRadius: "20px", border: "1px dashed #34A853" }}>
                <p style={{ color: "#34A853", fontWeight: "bold" }}>✅ Système sain. Aucun incident répertorié.</p>
              </div>
            ) : (
              logs.map(log => (
                <div key={log._id} style={{ 
                  background: "rgba(255,255,255,0.02)", 
                  padding: "1.5rem", 
                  borderRadius: "15px", 
                  border: "1px solid rgba(255,255,255,0.08)",
                  position: "relative"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div>
                      <span style={{ 
                        fontSize: "0.6rem", 
                        padding: "3px 8px", 
                        borderRadius: "50px", 
                        background: log.level === "FATAL" ? "#ff5252" : "#F9AB00", 
                        fontWeight: "900",
                        marginRight: "10px"
                      }}>
                        {log.level}
                      </span>
                      <span style={{ fontSize: "0.75rem", opacity: 0.5 }}>{formatDate(log.createdAt)}</span>
                    </div>
                    <div style={{ fontSize: "0.7rem", opacity: 0.4 }}>IP: {log.ip || "N/A"}</div>
                  </div>

                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.8rem", color: "#ff5252" }}>{log.message}</h3>
                  
                  <div style={{ fontSize: "0.85rem", background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "10px", marginBottom: "1rem" }}>
                    <p style={{ margin: "0 0 5px 0", color: "var(--primary)", fontWeight: "bold" }}>URL du crash :</p>
                    <code style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>{log.url}</code>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", fontSize: "0.8rem" }}>
                    <div>
                      <p style={{ opacity: 0.5, margin: "0 0 3px 0" }}>Utilisateur</p>
                      <pre style={{ margin: 0, background: "rgba(255,255,255,0.03)", padding: "5px", borderRadius: "5px" }}>
                        {JSON.stringify(log.user, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <p style={{ opacity: 0.5, margin: "0 0 3px 0" }}>Appareil / Navigateur</p>
                      <p style={{ margin: 0, fontSize: "0.7rem", opacity: 0.8 }}>{log.userAgent}</p>
                    </div>
                  </div>

                  {log.stack && (
                    <details style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                      <summary style={{ fontSize: "0.75rem", opacity: 0.5, cursor: "pointer" }}>Voir la pile d'exécution (Stack Trace)</summary>
                      <pre style={{ 
                        marginTop: "10px", 
                        fontSize: "0.7rem", 
                        color: "#aaa", 
                        background: "#000", 
                        padding: "15px", 
                        borderRadius: "10px", 
                        overflowX: "auto",
                        maxHeight: "200px"
                      }}>
                        {log.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default LogsPage;
