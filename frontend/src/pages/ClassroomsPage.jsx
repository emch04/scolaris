/**
 * @file ClassroomsPage.jsx
 * @description Page de gestion des classes (salles de classe) de l'établissement.
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getClassroomsRequest, createClassroomRequest } from "../services/classroom.api";
import { getSchoolsRequest } from "../services/school.api";
import { useToast } from "../context/ToastContext";

/**
 * ClassroomsPage.jsx
 * Rôle : Gestion des classes physiques et virtuelles de l'établissement.
 * Permet de définir les niveaux (ex: Primaire 6) et d'associer les classes aux écoles.
 */
function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();
  
  // État du formulaire de création de classe
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    school: ""
  });

  /**
   * fetchData
   * Logique : Charge les classes existantes et les écoles pour le sélecteur du formulaire.
   */
  const fetchData = async (pageNum = 1, search = searchTerm) => {
    try {
      const [resClass, resSchools] = await Promise.all([
        getClassroomsRequest(pageNum, 20, search),
        getSchoolsRequest(1, 100)
      ]);
      
      if (resClass?.data?.classrooms) {
        setClassrooms(resClass.data.classrooms);
        setPagination(resClass.data.pagination);
      } else {
        setClassrooms(resClass?.data || []);
      }
      
      setSchools(resSchools?.data?.schools || []);
    } catch (err) {
      showToast("Erreur de chargement.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * handleSearch
   */
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchData(1, searchTerm);
  };

  /**
   * handleSubmit
   * Logique : Crée une nouvelle classe via l'API.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClassroomRequest(formData);
      showToast("Classe créée avec succès.");
      setFormData({ name: "", level: "", school: "" });
      fetchData(pagination.page);
    } catch (err) {
      showToast("Erreur lors de la création.", "error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Structure de l'École
          </h1>
          <p style={{ opacity: 0.6 }}>Configurez les classes et niveaux d'enseignement</p>
        </div>

        {/* Formulaire simplifié d'ajout de classe */}
        <div style={{ 
          background: "transparent", 
          padding: "1.2rem", 
          borderRadius: "20px", 
          border: "1px solid rgba(255, 255, 255, 0.12)",
          marginBottom: "2.5rem"
        }}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.3rem" }}>Ajouter une classe</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <input 
                placeholder="Nom (ex: 6ème A)" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                style={{ background: "white", border: "1px solid #ccc", padding: "0.6rem", borderRadius: "8px", color: "#222", fontSize: "0.9rem" }}
                required 
              />
              <input 
                placeholder="Niveau (ex: Primaire 6)" 
                value={formData.level} 
                onChange={e => setFormData({...formData, level: e.target.value})} 
                style={{ background: "white", border: "1px solid #ccc", padding: "0.6rem", borderRadius: "8px", color: "#222", fontSize: "0.9rem" }}
                required 
              />
              <select 
                value={formData.school} 
                onChange={e => setFormData({...formData, school: e.target.value})} 
                style={{ background: "white", border: "1px solid #ccc", padding: "0.6rem", borderRadius: "8px", color: "#222", cursor: "pointer", fontSize: "0.9rem" }}
                required
              >
                <option value="" style={{ background: "white", color: "#222" }}>Choisir l'établissement</option>
                {schools.map(s => <option key={s._id} value={s._id} style={{ background: "white", color: "#222" }}>{s.name}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}>
              Enregistrer la classe
            </button>
          </form>
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
            placeholder="Rechercher par nom ou niveau..." 
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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
          <h2 style={{ fontSize: "1.3rem" }}>Classes actives ({pagination.total})</h2>
        </div>

        {loading ? <Loader /> : (
          <>
            <div className="grid">
              {classrooms.length === 0 ? (
                <p style={{ textAlign: "center", gridColumn: "1/-1", padding: "3rem", opacity: 0.5 }}>Aucune classe enregistrée ou trouvée.</p>
              ) : (
                classrooms.map(c => (
                  <div key={c._id} style={{ 
                    background: "transparent", 
                    padding: "1.2rem", 
                    borderRadius: "15px", 
                    border: "1px solid rgba(255, 255, 255, 0.12)"
                  }}>
                    <div style={{ fontSize: "0.65rem", color: "var(--primary)", fontWeight: "bold", marginBottom: "0.4rem" }}>{c.level}</div>
                    <h3 style={{ marginBottom: "0.8rem", fontSize: "1.1rem" }}>{c.name}</h3>
                    <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                      <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        {c.school?.name || "École non spécifiée"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "3rem", paddingBottom: "2rem" }}>
                <button 
                  onClick={() => { setLoading(true); fetchData(pagination.page - 1); window.scrollTo(0,0); }}
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
                  onClick={() => { setLoading(true); fetchData(pagination.page + 1); window.scrollTo(0,0); }}
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

export default ClassroomsPage;
