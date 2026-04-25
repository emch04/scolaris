/**
 * @file AssignmentsPage.jsx
 * @description Page de gestion et de consultation des devoirs pour les enseignants et les élèves.
 */

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
      <main className="container" style={{ padding: "1.5rem" }}>
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 6vw, 2.5rem)", fontWeight: "900", background: "linear-gradient(to right, #fff, #aaa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.5rem" }}>
            Gestion des Devoirs
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1rem" }}>Planifiez et diffusez les travaux pédagogiques</p>
        </div>

        {user?.role === "teacher" && (
          <div className="form" style={{ maxWidth: "700px", marginBottom: "3rem", padding: "1.5rem" }}>
            <h2 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "12px", fontSize: "1.3rem" }}>
              <div style={{ background: "var(--primary)", width: "10px", height: "10px", borderRadius: "50%" }}></div>
              Publier un nouveau travail
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.8 }}>Titre du devoir</label>
                  <input placeholder="Ex: Analyse de texte..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} required />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.8 }}>Matière</label>
                  <input placeholder="Ex: Français" list="subjects-list" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} required />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.8 }}>Classe</label>
                  <select value={formData.classroom} onChange={e => setFormData({...formData, classroom: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} required>
                    <option value="">Sélectionner une classe</option>
                    {classrooms.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.8 }}>Instructions</label>
                <textarea placeholder="Contenu du devoir..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ minHeight: "100px", padding: "10px", fontSize: "0.9rem" }} required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.8 }}>Date limite</label>
                  <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.8 }}>Fichier joint</label>
                  <input type="file" onChange={e => setFile(e.target.files[0])} style={{ background: "transparent", border: "none", color: "white", fontSize: "0.8rem" }} />
                </div>
              </div>

              <button className="btn btn-primary" style={{ padding: "0.8rem 2rem", width: "100%", maxWidth: "250px", alignSelf: "center" }} disabled={saving}>
                {saving ? "Publication..." : "PUBLIER LE DEVOIR"}
              </button>
            </form>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "800" }}>Flux des publications</h2>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px 15px", borderRadius: "50px", fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.1)" }}>
            <strong>{assignments.length}</strong> devoirs
          </div>
        </div>

        {loading ? <Loader /> : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {assignments.length === 0 ? (
              <p style={{ textAlign: "center", gridColumn: "1/-1", padding: "3rem", opacity: 0.4 }}>Aucun devoir publié.</p>
            ) : (
              assignments.map(a => (
                <div key={a._id} style={{ 
                  background: "rgba(255,255,255,0.02)", 
                  padding: "1.2rem", 
                  borderRadius: "16px", 
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: getSubjectColor(a.subject) }}></div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.6rem", padding: "3px 10px", borderRadius: "50px", background: `${getSubjectColor(a.subject)}20`, color: getSubjectColor(a.subject), fontWeight: "900", textTransform: "uppercase" }}>
                      {a.subject}
                    </div>
                    <span style={{ fontSize: "0.7rem", opacity: 0.4 }}>{formatDate(a.createdAt)}</span>
                  </div>

                  <h3 style={{ marginBottom: "0.8rem", fontSize: "1.2rem", fontWeight: "800" }}>{a.title}</h3>
                  <p style={{ fontSize: "0.9rem", opacity: 0.6, lineHeight: "1.5", marginBottom: "1.5rem", flex: 1 }}>
                    {a.description.length > 120 ? a.description.substring(0, 120) + "..." : a.description}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "bold" }}>
                        {a.teacher?.fullName?.charAt(0)}
                      </div>
                      <div style={{ fontSize: "0.75rem" }}>
                        <div style={{ fontWeight: "bold" }}>{a.teacher?.fullName}</div>
                        <div style={{ opacity: 0.4 }}>{a.classroom?.name}</div>
                      </div>
                    </div>
                    
                    {a.fileUrl && (
                      <a href={getFileUrl(a.fileUrl)} download target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "bold" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
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
