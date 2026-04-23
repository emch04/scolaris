import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Loader from "../components/Loader";
import { getSchoolsRequest, createSchoolRequest, validateSchoolRequest } from "../services/school.api";
import useAuth from "../hooks/useAuth";

function SchoolsPage() {
  const { user } = useAuth();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    commune: "Tshangu"
  });

  const fetchSchools = async () => {
    try {
      const response = await getSchoolsRequest();
      setSchools(response?.data || []);
    } catch (err) {
      setError("Impossible de charger les écoles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleValidate = async (id, status) => {
    if (!window.confirm(`Voulez-vous vraiment ${status === "approved" ? "approuver" : "rejeter"} cet établissement ?`)) return;
    try {
      await validateSchoolRequest(id, status);
      fetchSchools();
    } catch (err) {
      alert("Erreur lors de la validation.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createSchoolRequest(formData);
      setFormData({ name: "", code: "", address: "", commune: "Tshangu" });
      fetchSchools();
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de la création.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Espaces Scolaires
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Administration et annuaire des établissements partenaires</p>
        </div>

        {/* Mini Tableau de Bord */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
          <div style={{ 
            background: "rgba(0, 102, 204, 0.1)", 
            border: "1px solid #0066cc", 
            padding: "1rem 2rem", 
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#0066cc" }}>{schools.length}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", opacity: 0.7 }}>Écoles</div>
              <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>Partenaires du réseau</div>
            </div>
          </div>
        </div>

        {/* Formulaire - Réservé Super Admin uniquement */}
        {user?.role === "super_admin" && (
          <div style={{ 
            background: "transparent", 
            padding: "2rem", 
            borderRadius: "20px", 
            border: "3px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "3rem"
          }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Ajouter un établissement</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <input
                  type="text"
                  placeholder="Nom de l'école"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                  required
                />
                <input
                  type="text"
                  placeholder="Code (ex: EPS-001)"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                  required
                />
                <input
                  type="text"
                  placeholder="Commune"
                  value={formData.commune}
                  onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                />
                <input
                  type="text"
                  placeholder="Adresse complète"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                />
              </div>
              {error && <p style={{ color: "#ff5252", fontSize: "0.9rem" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "0.8rem 2rem" }} disabled={saving}>
                {saving ? "Enregistrement..." : "Confirmer l'ajout"}
              </button>
            </form>
          </div>
        )}

        {/* Liste des écoles */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem" }}>Écoles enregistrées</h2>
          <span style={{ opacity: 0.5, fontSize: "0.9rem" }}>{schools.length} établissements</span>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid">
            {schools.length === 0 ? (
              <p style={{ textAlign: "center", gridColumn: "1/-1", padding: "3rem", opacity: 0.5 }}>Aucun établissement répertorié.</p>
            ) : (
              schools.map((s) => (
                <div key={s._id} style={{ 
                  background: "transparent", 
                  padding: "1.5rem", 
                  borderRadius: "15px", 
                  border: "3px solid rgba(255, 255, 255, 0.1)",
                  transition: "transform 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "bold" }}>{s.code || "EN ATTENTE"}</div>
                      <span style={{ 
                        fontSize: "0.6rem", 
                        padding: "2px 8px", 
                        borderRadius: "4px", 
                        background: s.status === "approved" ? "#34A853" : s.status === "rejected" ? "#ff5252" : "#f9ab00",
                        fontWeight: "bold",
                        textTransform: "uppercase"
                      }}>
                        {s.status === "approved" ? "Validé" : s.status === "rejected" ? "Rejeté" : "En attente"}
                      </span>
                    </div>
                    <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>{s.name}</h3>
                    <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                      <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {s.commune}
                      </p>
                      <p style={{ marginTop: "0.4rem", fontSize: "0.8rem", paddingLeft: "22px" }}>{s.address || "Adresse non communiquée"}</p>
                      {s.adminFullName && (
                        <p style={{ marginTop: "0.8rem", fontSize: "0.8rem", opacity: 0.5 }}>
                          Resp: {s.adminFullName} ({s.adminEmail})
                        </p>
                      )}
                    </div>
                  </div>

                  {user?.role === "super_admin" && s.status === "pending" && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem" }}>
                      <button 
                        onClick={() => handleValidate(s._id, "approved")}
                        className="btn" 
                        style={{ flex: 1, padding: "0.5rem", background: "#34A853", fontSize: "0.8rem" }}
                      >
                        Approuver
                      </button>
                      <button 
                        onClick={() => handleValidate(s._id, "rejected")}
                        className="btn" 
                        style={{ flex: 1, padding: "0.5rem", background: "#ff5252", fontSize: "0.8rem" }}
                      >
                        Rejeter
                      </button>
                    </div>
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

export default SchoolsPage;