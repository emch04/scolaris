/**
 * @file SchoolsPage.jsx
 * @description Page de gestion et d'affichage de la liste des écoles enregistrées.
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getSchoolsRequest, createSchoolRequest, validateSchoolRequest, validateAllSchoolsRequest } from "../services/school.api";
import useAuth from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

function SchoolsPage() {
  const { user } = useAuth();
  const [schools, setSchools] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    commune: "Tshangu"
  });

  const fetchSchools = async (pageNum = 1, search = searchTerm) => {
    try {
      const response = await getSchoolsRequest(pageNum, 20, search);
      setSchools(response?.data?.schools || []);
      if (response?.data?.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err) {
      showToast("Impossible de charger les écoles.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchSchools(1, searchTerm);
  };

  const handleValidate = async (id, status) => {
    if (!window.confirm(`Voulez-vous vraiment ${status === "approved" ? "approuver" : "rejeter"} cet établissement ?`)) return;
    try {
      await validateSchoolRequest(id, status);
      showToast("Statut mis à jour.");
      fetchSchools(pagination.page);
    } catch (err) {
      showToast("Erreur lors de la validation.", "error");
    }
  };

  const handleValidateAll = async (status) => {
    const pendingCount = schools.filter(s => s.status === "pending").length;
    if (pendingCount === 0) {
      showToast("Aucune école en attente.", "info");
      return;
    }
    if (!window.confirm(`Voulez-vous vraiment ${status === "approved" ? "approuver" : "rejeter"} LES ${pendingCount} ÉTABLISSEMENTS ?`)) return;
    
    setSaving(true);
    try {
      await validateAllSchoolsRequest(status);
      showToast("Action groupée réussie.");
      fetchSchools();
    } catch (err) {
      showToast("Erreur lors de la validation groupée.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createSchoolRequest(formData);
      showToast("École ajoutée.");
      setFormData({ name: "", code: "", address: "", commune: "Tshangu" });
      fetchSchools();
    } catch (err) {
      showToast("Erreur lors de la création.", "error");
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
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#0066cc" }}>{pagination.total}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", opacity: 0.7 }}>Écoles</div>
              <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>{searchTerm ? "Résultats trouvés" : "Partenaires du réseau"}</div>
            </div>
          </div>
        </div>

        {/* Barre de Recherche */}
        <form onSubmit={handleSearch} style={{ 
          display: "flex", 
          maxWidth: "600px", 
          margin: "0 auto 3rem auto", 
          gap: "10px",
          background: "rgba(255,255,255,0.03)",
          padding: "8px",
          borderRadius: "15px",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <input 
            type="text" 
            placeholder="Rechercher par nom ou code..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1, 
              background: "transparent", 
              border: "none", 
              color: "white", 
              padding: "10px 15px", 
              outline: "none" 
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px", borderRadius: "10px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </form>

        {/* Formulaire - Réservé Super Admin uniquement */}
        {user?.role === "super_admin" && (
          <div className="form" style={{ maxWidth: "100%", marginBottom: "3rem" }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Ajouter un établissement</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <input
                  type="text"
                  placeholder="Nom de l'école"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Code (ex: EPS-001)"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Commune"
                  value={formData.commune}
                  onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Adresse complète"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end" }} disabled={saving}>
                {saving ? "Enregistrement..." : "Confirmer l'ajout"}
              </button>
            </form>
          </div>
        )}

        {/* Liste des écoles */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Écoles enregistrées</h2>
            <span style={{ opacity: 0.5, fontSize: "0.9rem" }}>{pagination.total} établissements</span>
          </div>
          
          {user?.role === "super_admin" && schools.filter(s => s.status === "pending").length > 0 && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={() => handleValidateAll("approved")}
                disabled={saving}
                className="btn"
                style={{ display: "flex", alignItems: "center", gap: "6px", background: "#34A853", color: "white", padding: "8px 16px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "bold", border: "none" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Tout Approuver ({schools.filter(s => s.status === "pending").length})
              </button>
              <button 
                onClick={() => handleValidateAll("rejected")}
                disabled={saving}
                className="btn"
                style={{ display: "flex", alignItems: "center", gap: "6px", background: "#EA4335", color: "white", padding: "8px 16px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "bold", border: "none" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Tout Rejeter
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="grid">
              {schools.length === 0 ? (
                <p style={{ textAlign: "center", gridColumn: "1/-1", padding: "3rem", opacity: 0.5 }}>Aucun résultat trouvé pour cette recherche.</p>
              ) : (
                schools.map((s) => (
                  <div key={s._id} style={{ 
                    background: "transparent", 
                    padding: "1.2rem", 
                    borderRadius: "15px", 
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    transition: "transform 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                        <div style={{ fontSize: "0.65rem", color: "var(--primary)", fontWeight: "bold" }}>{s.code || "EN ATTENTE"}</div>
                        <span style={{ 
                          fontSize: "0.55rem", 
                          padding: "2px 6px", 
                          borderRadius: "4px", 
                          background: s.status === "approved" ? "#34A853" : s.status === "rejected" ? "#ff5252" : "#f9ab00",
                          fontWeight: "bold",
                          textTransform: "uppercase"
                        }}>
                          {s.status === "approved" ? "Validé" : s.status === "rejected" ? "Rejeté" : "En attente"}
                        </span>
                      </div>
                      <h3 style={{ marginBottom: "0.8rem", fontSize: "1.1rem" }}>{s.name}</h3>
                      <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                        <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          {s.commune}
                        </p>
                        <p style={{ marginTop: "0.3rem", fontSize: "0.75rem", paddingLeft: "18px" }}>{s.address || "Adresse non communiquée"}</p>
                      </div>
                    </div>

                    {user?.role === "super_admin" && s.status === "pending" && (
                      <div style={{ display: "flex", gap: "8px", marginTop: "1.2rem" }}>
                        <button 
                          onClick={() => handleValidate(s._id, "approved")}
                          className="btn btn-success" 
                          style={{ flex: 1, fontSize: "0.75rem", padding: "0.4rem" }}
                        >
                          Approuver
                        </button>
                        <button 
                          onClick={() => handleValidate(s._id, "rejected")}
                          className="btn btn-danger" 
                          style={{ flex: 1, fontSize: "0.75rem", padding: "0.4rem" }}
                        >
                          Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Contrôles de pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "3rem", paddingBottom: "2rem" }}>
                <button 
                  onClick={() => { setLoading(true); fetchSchools(pagination.page - 1); window.scrollTo(0,0); }}
                  disabled={pagination.page === 1}
                  className="btn"
                  style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "white", opacity: pagination.page === 1 ? 0.3 : 1, cursor: pagination.page === 1 ? "not-allowed" : "pointer" }}
                >
                  ← Précédent
                </button>
                <span style={{ display: "flex", alignItems: "center", padding: "0 15px", fontSize: "0.9rem", opacity: 0.7, background: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                  Page {pagination.page} sur {pagination.totalPages}
                </span>
                <button 
                  onClick={() => { setLoading(true); fetchSchools(pagination.page + 1); window.scrollTo(0,0); }}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn"
                  style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "white", opacity: pagination.page === pagination.totalPages ? 0.3 : 1, cursor: pagination.page === pagination.totalPages ? "not-allowed" : "pointer" }}
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default SchoolsPage;
