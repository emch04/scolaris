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
    getClassroomsRequest()
      .then(res => setClassrooms(res?.data || []))
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
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Plan de Cours Annuel
          </h1>
          <p style={{ opacity: 0.6 }}>Consultez le programme et les objectifs pédagogiques de l'année</p>
        </div>

        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <select 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
            style={{ minWidth: "250px" }}
          >
            <option value="">Choisir une classe</option>
            {classrooms.map(c => <option key={c._id} value={c._id}>{c.name} ({c.level})</option>)}
          </select>

          {user?.role === "teacher" && selectedClass && (
            <button onClick={() => setShowForm(!showForm)} className={`btn ${showForm ? 'btn-danger' : 'btn-primary'}`}>
              {showForm ? "Annuler" : "Publier un plan"}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="form" style={{ marginBottom: "3rem", maxWidth: "100%" }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Nouveau plan de cours</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "5px", display: "block" }}>Matière</label>
                <input 
                  type="text" 
                  list="subjects-list"
                  placeholder="Ex: Mathématiques" 
                  value={formData.subject} 
                  onChange={e => setFormData({...formData, subject: e.target.value})} 
                  required 
                />
                <datalist id="subjects-list">
                  <option value="Mathématiques" />
                  <option value="Français" />
                  <option value="Anglais" />
                  <option value="Histoire" />
                  <option value="Géographie" />
                  <option value="Sciences" />
                  <option value="Informatique" />
                  <option value="Éducation Physique" />
                  <option value="Arts Plastiques" />
                  <option value="Musique" />
                  <option value="Citoyenneté" />
                </datalist>
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "5px", display: "block" }}>Année Scolaire</label>
                <input type="text" placeholder="Ex: 2025-2026" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "5px", display: "block" }}>Contenu du programme</label>
              <textarea placeholder="Décrivez les grands chapitres et objectifs de l'année..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} style={{ minHeight: "150px" }} required />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Document PDF (Optionnel)</label>
                <input type="file" onChange={e => setFile(e.target.files[0])} style={{ background: "transparent", border: "none", color: "white", padding: 0 }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: "0.8rem 3rem" }} disabled={saving}>
                {saving ? "Publication..." : "Publier le plan"}
              </button>
            </div>
          </form>
        )}

        {loading ? <Loader /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {plans.length > 0 ? plans.map(p => (
              <div key={p._id} style={{ 
                background: "rgba(255,255,255,0.02)", 
                padding: "2rem", 
                borderRadius: "25px", 
                border: "1px solid rgba(255, 255, 255, 0.08)",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: "50px", background: "var(--primary)", color: "white", display: "inline-block", marginBottom: "8px", fontWeight: "900", textTransform: "uppercase" }}>Programme {p.year}</div>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: "800", margin: 0 }}>{p.subject}</h3>
                    <p style={{ fontSize: "0.85rem", opacity: 0.5, marginTop: "5px" }}>Publié par {p.teacher?.fullName}</p>
                  </div>
                  
                  {p.fileUrl && (
                    <a 
                      href={getFileUrl(p.fileUrl)} 
                      download
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn" 
                      style={{ background: "rgba(255,255,255,0.1)", color: "white", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                      Consulter le PDF
                    </a>
                  )}
                </div>

                <div style={{ whiteSpace: "pre-wrap", opacity: 0.8, lineHeight: "1.8", fontSize: "1.05rem", background: "rgba(255,255,255,0.01)", padding: "1.5rem", borderRadius: "15px" }}>
                  {p.content}
                </div>
              </div>
            )) : selectedClass && (
              <div style={{ textAlign: "center", padding: "5rem", opacity: 0.3 }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <p>Aucun plan de cours publié pour cette classe.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default CoursePlanPage;
