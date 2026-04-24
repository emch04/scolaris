import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getAssignmentsRequest, createAssignmentRequest } from "../services/assignment.api";
import { getClassroomsRequest } from "../services/classroom.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";
import formatDate from "../utils/formatDate";
import { getFileUrl } from "../utils/fileUrl";

function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    classroom: "",
    dueDate: ""
  });

  const fetchData = async () => {
    try {
      const [resAssign, resClass] = await Promise.all([
        getAssignmentsRequest(),
        getClassroomsRequest()
      ]);
      setAssignments(resAssign?.data || []);
      setClassrooms(resClass?.data || []);
    } catch (err) {
      showToast("Erreur de chargement.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (file) data.append("file", file);
      data.append("teacher", user.id);

      await createAssignmentRequest(data);
      showToast("Devoir publié avec succès !");
      setFormData({ title: "", description: "", subject: "", classroom: "", dueDate: "" });
      setFile(null);
      fetchData();
    } catch (err) {
      showToast("Erreur lors de la publication.", "error");
    } finally {
      setSaving(false);
    }
  };

  const getSubjectColor = (subject) => {
    const s = subject.toLowerCase();
    if (s.includes("math")) return "#1A73E8";
    if (s.includes("français")) return "#E91E63";
    if (s.includes("science") || s.includes("bio")) return "#34A853";
    if (s.includes("histoire") || s.includes("géo")) return "#F9AB00";
    return "var(--primary)";
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", background: "linear-gradient(to right, #fff, #aaa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>
            Gestion des Devoirs
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1.2rem" }}>Planifiez et diffusez les travaux pédagogiques</p>
        </div>

        {user?.role === "teacher" && (
          <div className="form" style={{ maxWidth: "100%", marginBottom: "4rem" }}>
            <h2 style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ background: "var(--primary)", width: "12px", height: "12px", borderRadius: "50%" }}></div>
              Publier un nouveau travail
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", opacity: 0.8 }}>Titre du devoir</label>
                  <input 
                    placeholder="Ex: Analyse de texte - Le Petit Prince" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", opacity: 0.8 }}>Matière</label>
                  <input 
                    placeholder="Ex: Français" 
                    value={formData.subject} 
                    onChange={e => setFormData({...formData, subject: e.target.value})} 
                    required 
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", opacity: 0.8 }}>Classe destinataire</label>
                  <select 
                    value={formData.classroom} 
                    onChange={e => setFormData({...formData, classroom: e.target.value})} 
                    required
                  >
                    <option value="">Sélectionner une classe</option>
                    {classrooms.map(c => <option key={c._id} value={c._id}>{c.name} ({c.level})</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "600", opacity: 0.8 }}>Instructions détaillées</label>
                <textarea 
                  placeholder="Expliquez ici le contenu du devoir, les pages à lire ou les exercices à faire..." 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  style={{ minHeight: "150px" }}
                  required 
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", opacity: 0.8 }}>Date limite (Optionnel)</label>
                  <input 
                    type="date" 
                    value={formData.dueDate} 
                    onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", opacity: 0.8 }}>Fichier joint</label>
                  <input 
                    type="file" 
                    onChange={e => setFile(e.target.files[0])}
                    style={{ background: "transparent", border: "none", color: "white" }}
                  />
                </div>
              </div>

              <button className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "1.2rem 4rem" }} disabled={saving}>
                {saving ? "Publication..." : "PUBLIER LE DEVOIR"}
              </button>
            </form>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Flux des publications</h2>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "8px 20px", borderRadius: "50px", fontSize: "0.9rem", border: "1px solid rgba(255,255,255,0.1)" }}>
            <strong>{assignments.length}</strong> devoirs actifs
          </div>
        </div>

        {loading ? <Loader /> : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
            {assignments.length === 0 ? (
              <p style={{ textAlign: "center", gridColumn: "1/-1", padding: "5rem", opacity: 0.4 }}>Aucun devoir publié pour le moment.</p>
            ) : (
              assignments.map(a => (
                <div key={a._id} style={{ 
                  background: "rgba(255,255,255,0.02)", 
                  padding: "2rem", 
                  borderRadius: "25px", 
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  {/* Accent de couleur sur le côté */}
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "6px", background: getSubjectColor(a.subject) }}></div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                    <div style={{ 
                      fontSize: "0.7rem", 
                      padding: "5px 12px", 
                      borderRadius: "50px", 
                      background: `${getSubjectColor(a.subject)}20`, 
                      color: getSubjectColor(a.subject),
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}>
                      {a.subject}
                    </div>
                    <span style={{ fontSize: "0.75rem", opacity: 0.4 }}>{formatDate(a.createdAt)}</span>
                  </div>

                  <h3 style={{ marginBottom: "1rem", fontSize: "1.4rem", fontWeight: "800", lineHeight: "1.3" }}>{a.title}</h3>
                  <p style={{ fontSize: "0.95rem", opacity: 0.6, lineHeight: "1.6", marginBottom: "2rem", flex: 1 }}>
                    {a.description.length > 150 ? a.description.substring(0, 150) + "..." : a.description}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "bold" }}>
                        {a.teacher?.fullName?.charAt(0)}
                      </div>
                      <div style={{ fontSize: "0.8rem" }}>
                        <div style={{ fontWeight: "bold" }}>{a.teacher?.fullName}</div>
                        <div style={{ opacity: 0.4 }}>{a.classroom?.name}</div>
                      </div>
                    </div>
                    
                    {a.fileUrl && (
                      <a href={getFileUrl(a.fileUrl)} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: "5px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "bold" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                        Fichier
                      </a>
                    )}
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
