import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getClassroomsRequest } from "../services/classroom.api";
import { getSchoolsRequest } from "../services/school.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";
import apiClient from "../services/apiClient";

function ClassroomsPage() {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", level: "", school: "" });
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [resClass, resSchools] = await Promise.all([
        getClassroomsRequest(),
        getSchoolsRequest()
      ]);
      setClassrooms(resClass?.data || []);
      setSchools(resSchools?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/classrooms", formData);
      showToast("Classe créée avec succès !");
      setFormData({ name: "", level: "", school: "" });
      fetchData();
    } catch (err) {
      showToast("Erreur lors de la création.", "error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            Gestion des Classes
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Organisez les niveaux et les sections par établissement</p>
        </div>

        {/* Mini Tableau de Bord */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
          <div style={{ 
            background: "rgba(26, 115, 232, 0.1)", 
            border: "1px solid var(--primary)", 
            padding: "1rem 2rem", 
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "var(--primary)" }}>{classrooms.length}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", opacity: 0.7 }}>Salles de classe</div>
              <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>Actives sur le réseau</div>
            </div>
          </div>
        </div>

        {/* Formulaire épuré - Réservé Admin / Directeur / Super Admin */}
        {["super_admin", "admin", "director"].includes(user?.role) && (
          <div style={{ 
            background: "transparent", 
            padding: "2rem", 
            borderRadius: "20px", 
            border: "3px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "3rem"
          }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Ouvrir une nouvelle classe</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <input 
                  placeholder="Nom (ex: 6ème A)" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  style={{ background: "white", border: "2px solid #ccc", padding: "0.8rem", borderRadius: "8px", color: "#222" }}
                  required 
                />
                <input 
                  placeholder="Niveau (ex: Primaire 6)" 
                  value={formData.level} 
                  onChange={e => setFormData({...formData, level: e.target.value})} 
                  style={{ background: "white", border: "2px solid #ccc", padding: "0.8rem", borderRadius: "8px", color: "#222" }}
                  required 
                />
                <select 
                  value={formData.school} 
                  onChange={e => setFormData({...formData, school: e.target.value})} 
                  style={{ background: "white", border: "2px solid #ccc", padding: "0.8rem", borderRadius: "8px", color: "#222", cursor: "pointer" }}
                  required
                >
                  <option value="" style={{ background: "white", color: "#222" }}>Choisir l'établissement</option>
                  {schools.map(s => <option key={s._id} value={s._id} style={{ background: "white", color: "#222" }}>{s.name}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "0.8rem 2rem" }}>
                Enregistrer la classe
              </button>
            </form>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem" }}>Classes actives</h2>
        </div>

        {loading ? <Loader /> : (
          <div className="grid">
            {classrooms.length === 0 ? (
              <p style={{ textAlign: "center", gridColumn: "1/-1", padding: "3rem", opacity: 0.5 }}>Aucune classe enregistrée.</p>
            ) : (
              classrooms.map(c => (
                <div key={c._id} style={{ 
                  background: "transparent", 
                  padding: "1.5rem", 
                  borderRadius: "15px", 
                  border: "3px solid rgba(255, 255, 255, 0.1)"
                }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "bold", marginBottom: "0.5rem" }}>{c.level}</div>
                  <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>{c.name}</h3>
                  <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                    <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                      {c.school?.name || "École non spécifiée"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
}
export default ClassroomsPage;
