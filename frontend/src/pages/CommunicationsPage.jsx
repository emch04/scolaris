/**
 * @file CommunicationsPage.jsx
 * @description Page regroupant les communications officielles et les annonces de l'école.
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getCommunicationsRequest, createCommunicationRequest } from "../services/communication.api";
import { getSchoolsRequest } from "../services/school.api";
import { getClassroomsRequest } from "../services/classroom.api";
import { getStudentsRequest } from "../services/student.api";
import { getTeachersRequest } from "../services/teacher.api";
import formatDate from "../utils/formatDate";
import useAuth from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { getFileUrl } from "../utils/fileUrl";

function CommunicationsPage() {
  const { user } = useAuth();
  const [communications, setCommunications] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "communique",
    classroom: "",
    targetStudent: "",
    targetTeacher: "",
    targetType: "classe" // "classe", "eleve", "prof"
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const resComm = await getCommunicationsRequest();
      setCommunications(resComm?.data || []);

      // On ne charge les listes de sélection que si l'utilisateur peut publier
      if (["teacher", "admin", "director", "super_admin"].includes(user?.role)) {
        const [resClassrooms, resStudents, resTeachers] = await Promise.all([
          getClassroomsRequest(),
          getStudentsRequest(),
          getTeachersRequest()
        ]);
        setClassrooms(resClassrooms?.data || []);
        setStudents(resStudents?.data || []);
        setTeachers(resTeachers?.data || []);
      }
    } catch (err) {
      console.error("Erreur de chargement", err);
      showToast("Erreur de chargement des communications.", "error");
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
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("type", formData.type);
      
      if (formData.classroom) data.append("classroom", formData.classroom);
      if (formData.targetStudent) data.append("targetStudent", formData.targetStudent);
      if (formData.targetTeacher) data.append("targetTeacher", formData.targetTeacher);
      if (file) data.append("file", file);

      await createCommunicationRequest(data);
      showToast("Message publié et alertes envoyées !");
      setFormData({ title: "", content: "", type: "communique", classroom: "", targetStudent: "", targetTeacher: "", targetType: "classe" });
      setFile(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de la publication.", "error");
    } finally {
      setSaving(false);
    }
  };

  const getTypeStyle = (type) => {
    return type === "convocation" 
      ? { color: "#ff5252", bg: "rgba(255,82,82,0.15)" }
      : { color: "#34A853", bg: "rgba(52,168,83,0.15)" };
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", background: "linear-gradient(to right, #fff, #aaa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>
            Communications
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1.2rem" }}>Actualités et informations officielles</p>
        </div>

        {["teacher", "admin", "director", "super_admin"].includes(user?.role) && (
          <div className="form" style={{ maxWidth: "100%", marginBottom: "4rem" }}>
            <h2 style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ background: "var(--primary)", width: "12px", height: "12px", borderRadius: "50%" }}></div>
              Publier un message
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", opacity: 0.7 }}>Titre</label>
                  <input placeholder="Titre..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", opacity: 0.7 }}>Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value, targetType: "classe"})}>
                    <option value="communique">Communiqué</option>
                    <option value="convocation">Convocation</option>
                  </select>
                </div>
              </div>

              {/* Sélection de la cible (Classe/Élève/Prof) */}
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "15px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", opacity: 0.7, marginBottom: "1rem", display: "block" }}>Cible du message :</label>
                
                {/* Type de cible - Pour tout le personnel autorisé à publier */}
                {["teacher", "admin", "director", "super_admin"].includes(user.role) && (
                  <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                    <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
                      <input type="radio" checked={formData.targetType === "classe"} onChange={() => setFormData({...formData, targetType: "classe", targetTeacher: "", targetStudent: ""})} style={{ width: "18px", height: "18px" }} /> Toute la classe
                    </label>
                    <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
                      <input type="radio" checked={formData.targetType === "eleve"} onChange={() => setFormData({...formData, targetType: "eleve", targetTeacher: ""})} style={{ width: "18px", height: "18px" }} /> Un élève précis
                    </label>
                    <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
                      <input type="radio" checked={formData.targetType === "prof"} onChange={() => setFormData({...formData, targetType: "prof", targetStudent: "", classroom: ""})} style={{ width: "18px", height: "18px" }} /> Un professeur
                    </label>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  {/* Sélection de la classe - Toujours visible pour les profs ou si targetType est classe/eleve */}
                  {(user.role === "teacher" || formData.targetType === "classe" || formData.targetType === "eleve") && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ fontSize: "0.75rem", opacity: 0.6 }}>Classe</label>
                      <select 
                        value={formData.classroom} 
                        onChange={e => setFormData({...formData, classroom: e.target.value, targetStudent: ""})} 
                        required={user.role === "teacher" || formData.targetType === "eleve"}
                      >
                        <option value="">{user.role === "teacher" ? "Choisir votre classe" : "Toute l'école (Global)"}</option>
                        {classrooms.map(c => <option key={c._id} value={c._id}>{c.name} ({c.level})</option>)}
                      </select>
                    </div>
                  )}
                  
                  {/* Sélection de l'élève (si targetType === eleve) */}
                  {formData.targetType === "eleve" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ fontSize: "0.75rem", opacity: 0.6 }}>Élève</label>
                      <select 
                        value={formData.targetStudent} 
                        onChange={e => setFormData({...formData, targetStudent: e.target.value})} 
                        required 
                        disabled={!formData.classroom}
                      >
                        <option value="">{formData.classroom ? "Choisir l'élève" : "Sélectionnez d'abord la classe"}</option>
                        {students.filter(s => (s.classroom?._id || s.classroom) === formData.classroom).map(s => <option key={s._id} value={s._id}>{s.fullName}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Sélection du professeur (si targetType === prof) */}
                  {formData.targetType === "prof" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ fontSize: "0.75rem", opacity: 0.6 }}>Enseignant</label>
                      <select value={formData.targetTeacher} onChange={e => setFormData({...formData, targetTeacher: e.target.value})} required>
                        <option value="">Choisir l'enseignant</option>
                        {teachers.filter(t => t.role === "teacher").map(t => <option key={t._id} value={t._id}>{t.fullName}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", opacity: 0.7 }}>Contenu</label>
                <textarea placeholder="Message..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} style={{ minHeight: "120px" }} required />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <input type="file" onChange={e => setFile(e.target.files[0])} style={{ color: "white", width: "auto", background: "transparent", border: "none" }} />
                <button className="btn btn-primary" style={{ padding: "1rem 3rem" }} disabled={saving}>DIFFUSER</button>
              </div>
            </form>
          </div>
        )}

        {loading ? <Loader /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {communications.map(c => (
              <div key={c._id} style={{ background: "rgba(255,255,255,0.02)", padding: "2.5rem", borderRadius: "25px", border: "1px solid rgba(255, 255, 255, 0.08)", position: "relative" }}>
                <div style={{ position: "absolute", top: "2.5rem", right: "2.5rem", padding: "5px 15px", borderRadius: "50px", fontSize: "0.7rem", fontWeight: "900", textTransform: "uppercase", background: getTypeStyle(c.type).bg, color: getTypeStyle(c.type).color }}>{c.type}</div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "0.5rem" }}>{c.title}</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", fontSize: "0.8rem", opacity: 0.5, marginBottom: "1.5rem" }}>
                  <span>{formatDate(c.createdAt)}</span> • <span>Par {c.author?.fullName}</span>
                  {c.targetStudent && <span style={{ color: "#ff5252", fontWeight: "bold" }}> • Pour: {c.targetStudent?.fullName}</span>}
                  {c.targetTeacher && <span style={{ color: "#F9AB00", fontWeight: "bold" }}> • Pour: {c.targetTeacher?.fullName}</span>}
                </div>
                <p style={{ fontSize: "1.05rem", lineHeight: "1.8", opacity: 0.8, whiteSpace: "pre-wrap", marginBottom: c.fileUrl ? "2rem" : "0" }}>{c.content}</p>
                
                {c.fileUrl && (
                  <div style={{ 
                    marginTop: "1.5rem", 
                    paddingTop: "1.5rem", 
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    justifyContent: "flex-end"
                  }}>
                    <a
                      href={getFileUrl(c.fileUrl)}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ background: "rgba(255,255,255,0.1)", color: "white", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}
                    >                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                      Voir la pièce jointe
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default CommunicationsPage;
