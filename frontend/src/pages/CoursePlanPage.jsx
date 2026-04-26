/**
 * @file CoursePlanPage.jsx
 * @description Page de consultation et de gestion du plan de cours et du programme pédagogique.
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getCoursePlansRequest, addCoursePlanRequest } from "../services/courseplan.api";
import { getClassroomsRequest } from "../services/classroom.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";

import formatDate from "../utils/formatDate";
import { getFileUrl } from "../utils/fileUrl";

function CoursePlanPage() {
  const { classroomId } = useParams();
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(classroomId || "");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ subject: "", content: "", year: "2023-2024" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    getClassroomsRequest(1, 100) // On récupère jusqu'à 100 classes
      .then(res => setClassrooms(res?.data?.classrooms || res?.data || []))
      .finally(() => setLoading(false));
  }, []);

  const fetchPlans = async (classId) => {
    if (!classId) return;
    setLoading(true);
    try {
      const res = await getCoursePlansRequest(classId);
      setPlans(res?.data || []);
    } catch (err) {
      showToast("Erreur de chargement.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (selectedClass) fetchPlans(selectedClass); }, [selectedClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("subject", formData.subject);
      data.append("year", formData.year);
      data.append("content", formData.content);
      data.append("classroom", selectedClass);
      if (file) data.append("file", file);

      await addCoursePlanRequest(data);
      showToast("Plan de cours publié !");
      setShowForm(false);
      setFormData({ subject: "", content: "", year: "2023-2024" });
      setFile(null);
      fetchPlans(selectedClass);
    } catch (err) {
      showToast("Erreur lors de la publication.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (user?.role === "super_admin") return <><Navbar /><main className="container" style={{ textAlign: "center", padding: "5rem" }}>Accès refusé. Le Super Admin ne gère pas les plans de cours.</main></>;

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "1.5rem" }}>
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 6vw, 2.5rem)", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.5rem" }}>
            Plan de Cours Annuel
          </h1>
          <p style={{ opacity: 0.6, fontSize: "0.95rem" }}>Consultez le programme et les objectifs pédagogiques</p>
        </div>

        <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <select 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
            style={{ flex: "1", minWidth: "200px", padding: "12px", borderRadius: "10px", border: "none", background: "white", color: "#222", fontSize: "0.9rem" }}
          >
            <option value="">Choisir une classe</option>
            {classrooms.map(c => <option key={c._id} value={c._id}>{c.name} ({c.level})</option>)}
          </select>

          {user?.role === "teacher" && selectedClass && (
            <button onClick={() => setShowForm(!showForm)} className={`btn ${showForm ? 'btn-danger' : 'btn-primary'}`} style={{ padding: "10px 20px", fontSize: "0.85rem" }}>
              {showForm ? "Annuler" : "Publier un plan"}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="form" style={{ marginBottom: "2.5rem", maxWidth: "700px", padding: "1.5rem" }}>
            <h3 style={{ marginBottom: "1.2rem", fontSize: "1.2rem" }}>Nouveau plan de cours</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "5px", display: "block" }}>Matière</label>
                <input type="text" list="subjects-list" placeholder="Ex: Mathématiques" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} required />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "5px", display: "block" }}>Année Scolaire</label>
                <input type="text" placeholder="Ex: 2025-2026" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} required />
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "5px", display: "block" }}>Contenu du programme</label>
              <textarea placeholder="Objectifs de l'année..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} style={{ minHeight: "120px", padding: "10px", fontSize: "0.9rem" }} required />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.75rem", opacity: 0.7 }}>PDF (Optionnel)</label>
                <input type="file" onChange={e => setFile(e.target.files[0])} style={{ background: "transparent", border: "none", color: "white", fontSize: "0.8rem", padding: 0 }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "0.9rem" }} disabled={saving}>
                {saving ? "Publication..." : "Publier le plan"}
              </button>
            </div>
          </form>
        )}

        {loading ? <Loader /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {plans.length > 0 ? plans.map(p => (
              <div key={p._id} style={{ 
                background: "rgba(255,255,255,0.02)", 
                padding: "1.5rem", 
                borderRadius: "20px", 
                border: "1px solid rgba(255, 255, 255, 0.08)",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.8rem" }}>
                  <div>
                    <div style={{ fontSize: "0.6rem", padding: "3px 8px", borderRadius: "50px", background: "var(--primary)", color: "white", display: "inline-block", marginBottom: "5px", fontWeight: "900", textTransform: "uppercase" }}>Programme {p.year}</div>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: "800", margin: 0 }}>{p.subject}</h3>
                    <p style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "2px" }}>Par {p.teacher?.fullName}</p>
                  </div>
                  
                  {p.fileUrl && (
                    <a href={getFileUrl(p.fileUrl)} download target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "rgba(255,255,255,0.1)", color: "white", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                      PDF
                    </a>
                  )}
                </div>

                <div style={{ whiteSpace: "pre-wrap", opacity: 0.8, lineHeight: "1.6", fontSize: "0.95rem", background: "rgba(255,255,255,0.01)", padding: "1rem", borderRadius: "12px" }}>
                  {p.content}
                </div>
              </div>
            )) : selectedClass && (
              <div style={{ textAlign: "center", padding: "3rem", opacity: 0.3 }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                <p style={{ fontSize: "0.9rem" }}>Aucun plan de cours publié.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default CoursePlanPage;
