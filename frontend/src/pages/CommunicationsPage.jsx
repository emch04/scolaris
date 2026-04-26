/**
 * @file CommunicationsPage.jsx
 * @description Page regroupant les communications officielles et les annonces de l'école.
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getCommunicationsRequest, createCommunicationRequest } from "../services/communication.api";
import { getClassroomsRequest } from "../services/classroom.api";
import { getStudentsRequest } from "../services/student.api";
import { getTeachersRequest } from "../services/teacher.api";
import { getSchoolsRequest } from "../services/school.api";
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
  const [schools, setSchools] = useState([]);
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
    targetSchool: "",
    targetType: "classe" // "classe", "eleve", "prof", "ecole"
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const resComm = await getCommunicationsRequest();
      setCommunications(resComm?.data || []);

      if (["teacher", "admin", "director", "super_admin"].includes(user?.role)) {
        // Pour les listes de sélection, on récupère une large plage (ex: 100 éléments)
        const fetchPromises = [
          getClassroomsRequest(1, 100),
          getStudentsRequest(1, 100),
          getTeachersRequest(1, 100)
        ];

        if (user.role === "super_admin") {
          fetchPromises.push(getSchoolsRequest(1, 100));
        }

        const results = await Promise.all(fetchPromises);
        
        // Correction de l'extraction des données paginées
        setClassrooms(results[0]?.data?.classrooms || results[0]?.data || []);
        setStudents(results[1]?.data?.students || results[1]?.data || []);
        setTeachers(results[2]?.data?.teachers || results[2]?.data || []);
        
        if (user.role === "super_admin" && results[3]) {
          setSchools(results[3]?.data?.schools || results[3]?.data || []);
        }
      }
    } catch (err) {
      console.error("Erreur de chargement", err);
      showToast("Erreur de chargement des données.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      if (formData.targetSchool) data.append("targetSchool", formData.targetSchool);
      if (file) data.append("file", file);

      await createCommunicationRequest(data);
      showToast("Message publié !");
      setFormData({ title: "", content: "", type: "communique", classroom: "", targetStudent: "", targetTeacher: "", targetSchool: "", targetType: "classe" });
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
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", fontWeight: "900", background: "linear-gradient(to right, #fff, #aaa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.5rem" }}>
            Communications
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1rem" }}>Actualités et informations officielles</p>
        </div>

        {["teacher", "admin", "director", "super_admin"].includes(user?.role) && (
          <div className="form" style={{ maxWidth: "700px", marginBottom: "2.5rem", padding: "1.2rem 1.5rem" }}>
            <h2 style={{ marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "12px", fontSize: "1.3rem" }}>
              <div style={{ background: "var(--primary)", width: "10px", height: "10px", borderRadius: "50%" }}></div>
              Publier un message
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.7 }}>Titre</label>
                  <input placeholder="Titre..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ padding: "0.6rem 0.8rem", fontSize: "0.9rem" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.7 }}>Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value, targetType: "classe"})} style={{ padding: "0.6rem 0.8rem", fontSize: "0.9rem" }}>
                    <option value="communique">Communiqué</option>
                    <option value="convocation">Convocation</option>
                  </select>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.7, marginBottom: "0.8rem", display: "block" }}>Cible du message :</label>
                
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                  <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}>
                    <input type="radio" checked={formData.targetType === "classe"} onChange={() => setFormData({...formData, targetType: "classe", targetTeacher: "", targetStudent: "", targetSchool: ""})} style={{ width: "16px", height: "16px" }} /> {user.role === 'super_admin' ? 'Toute la plateforme' : 'Toute la classe'}
                  </label>
                  
                  {user.role === "super_admin" ? (
                    <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}>
                      <input type="radio" checked={formData.targetType === "ecole"} onChange={() => setFormData({...formData, targetType: "ecole", targetTeacher: "", targetStudent: "", classroom: "", targetSchool: ""})} style={{ width: "16px", height: "16px" }} /> Une école précise
                    </label>
                  ) : (
                    <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}>
                      <input type="radio" checked={formData.targetType === "eleve"} onChange={() => setFormData({...formData, targetType: "eleve", targetTeacher: "", targetSchool: ""})} style={{ width: "16px", height: "16px" }} /> Un élève précis
                    </label>
                  )}

                  <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}>
                    <input type="radio" checked={formData.targetType === "prof"} onChange={() => setFormData({...formData, targetType: "prof", targetStudent: "", classroom: "", targetSchool: ""})} style={{ width: "16px", height: "16px" }} /> Un professeur
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.8rem" }}>
                  {/* Sélection de la classe */}
                  {(user?.role !== "super_admin" && (formData.targetType === "classe" || formData.targetType === "eleve")) && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={{ fontSize: "0.7rem", opacity: 0.6 }}>Classe</label>
                      <select 
                        value={formData.classroom} 
                        onChange={e => setFormData({...formData, classroom: e.target.value, targetStudent: ""})} 
                        required={formData.targetType === "eleve" || user.role === "teacher"}
                        style={{ padding: "0.5rem 0.7rem", fontSize: "0.85rem" }}
                      >
                        <option value="">{user.role === "teacher" ? "Choisir votre classe" : "Toute l'école"}</option>
                        {classrooms.map(c => <option key={c._id} value={c._id}>{c.name} ({c.level})</option>)}
                      </select>
                    </div>
                  )}
                  
                  {/* Sélection de l'élève */}
                  {formData.targetType === "eleve" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={{ fontSize: "0.7rem", opacity: 0.6 }}>Élève</label>
                      <select 
                        value={formData.targetStudent} 
                        onChange={e => setFormData({...formData, targetStudent: e.target.value})} 
                        required 
                        disabled={!formData.classroom}
                        style={{ padding: "0.5rem 0.7rem", fontSize: "0.85rem" }}
                      >
                        <option value="">{formData.classroom ? "Choisir l'élève" : "Sélectionnez d'abord la classe"}</option>
                        {students.filter(s => (s.classroom?._id || s.classroom) === formData.classroom).map(s => <option key={s._id} value={s._id}>{s.fullName}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Sélection du professeur */}
                  {formData.targetType === "prof" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={{ fontSize: "0.7rem", opacity: 0.6 }}>Enseignant</label>
                      <select value={formData.targetTeacher} onChange={e => setFormData({...formData, targetTeacher: e.target.value})} required style={{ padding: "0.5rem 0.7rem", fontSize: "0.85rem" }}>
                        <option value="">Choisir l'enseignant</option>
                        {teachers.filter(t => t.role === "teacher").map(t => <option key={t._id} value={t._id}>{t.fullName}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Sélection de l'école (Super Admin uniquement) */}
                  {formData.targetType === "ecole" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={{ fontSize: "0.7rem", opacity: 0.6 }}>École cible</label>
                      <select value={formData.targetSchool} onChange={e => setFormData({...formData, targetSchool: e.target.value})} required style={{ padding: "0.5rem 0.7rem", fontSize: "0.85rem" }}>
                        <option value="">Choisir l'école</option>
                        {schools.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.7 }}>Contenu</label>
                <textarea placeholder="Message..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} style={{ minHeight: "120px", padding: "0.6rem 0.8rem", fontSize: "0.9rem" }} required />
              </div>

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div style={{ flex: 1, minWidth: "180px" }}>
                  <input type="file" onChange={e => setFile(e.target.files[0])} style={{ color: "white", width: "100%", background: "transparent", border: "none", fontSize: "0.8rem" }} />
                </div>
                <button className="btn btn-primary" style={{ padding: "0.8rem 2rem", width: "100%", maxWidth: "200px" }} disabled={saving}>DIFFUSER</button>
              </div>
            </form>
          </div>
        )}

        {loading ? <Loader /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
            {communications.map(c => (
              <div key={c._id} style={{ 
                background: "rgba(255,255,255,0.02)", 
                padding: "1.2rem", 
                borderRadius: "16px", 
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: "700px"
              }}>
                <div style={{ 
                  alignSelf: "flex-start",
                  marginBottom: "0.8rem",
                  padding: "3px 10px", 
                  borderRadius: "50px", 
                  fontSize: "0.6rem", 
                  fontWeight: "900", 
                  textTransform: "uppercase", 
                  background: getTypeStyle(c.type).bg, 
                  color: getTypeStyle(c.type).color 
                }}>
                  {c.type}
                </div>
                
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.4rem", lineHeight: "1.2" }}>{c.title}</h3>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", fontSize: "0.7rem", opacity: 0.5, marginBottom: "0.8rem" }}>
                  <span>{formatDate(c.createdAt)}</span>
                  <span>•</span>
                  <span>Par {c.author?.fullName}</span>
                  {c.targetStudent && <span style={{ color: "#ff5252", fontWeight: "bold" }}> • Pour: {c.targetStudent?.fullName}</span>}
                  {c.targetTeacher && <span style={{ color: "#F9AB00", fontWeight: "bold" }}> • Pour: {c.targetTeacher?.fullName}</span>}
                  {c.targetSchool && <span style={{ color: "var(--primary)", fontWeight: "bold" }}> • École: {c.targetSchool?.name}</span>}
                </div>
                <p style={{ fontSize: "1rem", lineHeight: "1.6", opacity: 0.8, whiteSpace: "pre-wrap", marginBottom: c.fileUrl ? "1.5rem" : "0" }}>{c.content}</p>
                
                {c.fileUrl && (
                  <div style={{ 
                    marginTop: "auto",
                    paddingTop: "1rem", 
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    display: "flex"
                  }}>
                    <a
                      href={getFileUrl(c.fileUrl)}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ background: "rgba(255,255,255,0.1)", color: "white", fontSize: "0.8rem", width: "100%", justifyContent: "center" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                      Pièce jointe
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
