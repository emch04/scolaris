/**
 * @file SettingsPage.jsx
 * @description Page de contrôle suprême pour le Hero Admin. Gestion dynamique des modules et des accès rôles.
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getSystemConfigsRequest, toggleSystemFeatureRequest } from "../services/config.api";
import { useToast } from "../context/ToastContext";

function SettingsPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchConfigs = async () => {
    try {
      const res = await getSystemConfigsRequest();
      setConfigs(res?.data || []);
    } catch (err) {
      showToast("Erreur de chargement.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleToggle = async (key, currentStatus, label) => {
    try {
      const newStatus = !currentStatus;
      await toggleSystemFeatureRequest(key, newStatus);
      setConfigs(configs.map(c => c.key === key ? { ...c, enabled: newStatus } : c));
      showToast(`${label} : ${newStatus ? 'Activé' : 'Désactivé'}`);
    } catch (err) {
      showToast("Erreur lors de la modification.", "error");
    }
  };

  // Extraction dynamique des catégories uniques présentes dans les données
  const categories = [...new Set(configs.map(c => c.category))].sort((a, b) => {
    // On force l'ordre : Modules en premier, Rôles en deuxième, le reste après
    if (a === "Modules") return -1;
    if (b === "Modules") return 1;
    if (a === "Rôles") return -1;
    if (b === "Rôles") return 1;
    return a.localeCompare(b);
  });

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "2rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Configuration Système
          </h1>
          <p style={{ opacity: 0.6 }}>Activez ou désactivez les composants de Scolaris en temps réel.</p>
        </div>

        {loading ? <Loader /> : (
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {categories.length === 0 ? (
               <p style={{ textAlign: "center", opacity: 0.5 }}>Aucun paramètre trouvé.</p>
            ) : categories.map(cat => (
              <section key={cat}>
                <h2 style={{ fontSize: "1.1rem", marginBottom: "1.2rem", color: "var(--primary)", borderLeft: "4px solid var(--primary)", paddingLeft: "15px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "800" }}>
                  {cat}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {configs.filter(c => c.category === cat).map(config => (
                    <div key={config._id} style={{ 
                      background: "rgba(255,255,255,0.02)", 
                      padding: "1.2rem 1.5rem", 
                      borderRadius: "20px", 
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      opacity: config.enabled ? 1 : 0.6,
                      transition: "all 0.3s ease"
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "1.1rem", margin: "0 0 5px 0", fontWeight: "700" }}>{config.label}</h3>
                        <p style={{ fontSize: "0.8rem", opacity: 0.5, margin: 0, lineHeight: "1.4" }}>{config.description}</p>
                      </div>

                      <div 
                        onClick={() => handleToggle(config.key, config.enabled, config.label)}
                        style={{ 
                          width: "55px", 
                          height: "30px", 
                          background: config.enabled ? "#34A853" : "#333", 
                          borderRadius: "50px", 
                          position: "relative", 
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: config.enabled ? "0 0 15px rgba(52, 168, 83, 0.2)" : "none"
                        }}
                      >
                        <div style={{ 
                          width: "22px", 
                          height: "22px", 
                          background: "white", 
                          borderRadius: "50%", 
                          position: "absolute", 
                          top: "4px", 
                          left: config.enabled ? "29px" : "4px",
                          transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(255, 82, 82, 0.05)", borderRadius: "20px", border: "1px dashed rgba(255, 82, 82, 0.3)" }}>
               <h4 style={{ color: "#ff5252", margin: "0 0 10px 0", fontSize: "0.9rem" }}>⚠️ Avertissement Stratégique</h4>
               <p style={{ fontSize: "0.8rem", opacity: 0.7, lineHeight: "1.5", margin: 0 }}>
                 Toute modification des <strong>Rôles</strong> impacte immédiatement la capacité des utilisateurs à se connecter et leur visibilité dans l'annuaire. Toute modification des <strong>Modules</strong> restreint l'usage des fonctionnalités sans toucher aux comptes.
               </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default SettingsPage;
