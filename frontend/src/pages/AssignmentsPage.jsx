import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Loader from "../components/Loader";
import { getAssignmentsRequest, createAssignmentRequest } from "../services/assignment.api";
import { getClassroomsRequest } from "../services/classroom.api";
import useAuth from "../hooks/useAuth";

function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    classroom: ""
  });
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    try {
      const [resAssignments, resClassrooms] = await Promise.all([
        getAssignmentsRequest(),
        getClassroomsRequest()
      ]);
      setAssignments(resAssignments?.data || []);
      setClassrooms(resClassrooms?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("subject", formData.subject);
      data.append("classroom", formData.classroom);
      data.append("teacher", user.id);
      if (file) {
        data.append("file", file);
      }

      await createAssignmentRequest(data);
      setFormData({ title: "", description: "", subject: "", classroom: "" });
      setFile(null);
      fetchData();
    } catch (err) {
      alert("Erreur lors de la publication.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            Gestion des Devoirs
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Publiez des leçons et des exercices pour vos classes</p>
        </div>

        {/* Formulaire épuré */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.03)", 
          padding: "2rem", 
          borderRadius: "20px", 
          border: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: "3rem"
        }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Publier un nouveau devoir</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Titre du devoir</label>
                <input 
                  placeholder="Ex: Les fractions" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                  required 
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Matière</label>
                <input 
                  placeholder="Ex: Mathématiques" 
                  value={formData.subject} 
                  onChange={e => setFormData({...formData, subject: e.target.value})} 
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                  required 
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Classe concernée</label>
                <select 
                  value={formData.classroom} 
                  onChange={e => setFormData({...formData, classroom: e.target.value})} 
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                  required
                >
                  <option value="" style={{ background: "#222" }}>Sélectionner la classe</option>
                  {classrooms.map(c => <option key={c._id} value={c._id} style={{ background: "#222" }}>{c.name}</option>)}
                </select>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Consignes et contenu</label>
              <textarea 
                placeholder="Décrivez le travail à faire..." 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white", minHeight: "120px", resize: "vertical" }}
                required 
              />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Joindre un fichier (Optionnel)</label>
              <input 
                type="file" 
                onChange={e => setFile(e.target.files[0])}
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
              />
            </div>
            
            <button className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "0.8rem 2rem" }}>
              Publier le devoir
            </button>
          </form>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem" }}>Mes publications</h2>
          <span style={{ opacity: 0.5, fontSize: "0.9rem" }}>{assignments.length} devoirs publiés</span>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><Loader /></div>
        ) : (
          <div className="grid">
            {assignments.length === 0 ? (
              <p style={{ textAlign: "center", gridColumn: "1/-1", padding: "3rem", opacity: 0.5 }}>Vous n'avez pas encore publié de devoirs.</p>
            ) : (
              assignments.map(a => (
                <div key={a._id} style={{ 
                  background: "rgba(255, 255, 255, 0.05)", 
                  padding: "1.5rem", 
                  borderRadius: "15px", 
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "bold", textTransform: "uppercase" }}>{a.subject}</span>
                    <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>{a.classroom?.name}</span>
                  </div>
                  <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>{a.title}</h3>
                  <p style={{ fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.5", marginBottom: "1rem" }}>
                    {a.description}
                  </p>
                  
                  {a.fileUrl && (
                    <div style={{ marginBottom: "1rem" }}>
                      <a 
                        href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${a.fileUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: "var(--primary)", fontSize: "0.85rem", textDecoration: "underline" }}
                      >
                        📂 Voir le fichier joint
                      </a>
                    </div>
                  )}

                  <div style={{ fontSize: "0.75rem", opacity: 0.4, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.8rem" }}>
                    Publié le {new Date(a.createdAt).toLocaleDateString()}
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

export default AssignmentsPage;