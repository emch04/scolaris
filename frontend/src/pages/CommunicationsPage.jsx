import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getCommunicationsRequest, createCommunicationRequest } from "../services/communication.api";
import { getSchoolsRequest } from "../services/school.api";
import { getClassroomsRequest } from "../services/classroom.api";
import useAuth from "../hooks/useAuth";
import formatDate from "../utils/formatDate";

function CommunicationsPage() {
  const { user } = useAuth();
  const [communications, setCommunications] = useState([]);
  const [schools, setSchools] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "communique",
    school: "",
    classroom: ""
  });
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    try {
      const params = {};
      if (user?.role === "student") {
        params.school = user.school;
        params.classroom = user.classroom;
      }

      const [resComm, resSchools, resClassrooms] = await Promise.all([
        getCommunicationsRequest(params),
        getSchoolsRequest(),
        getClassroomsRequest()
      ]);
      setCommunications(resComm?.data || []);
      setSchools(resSchools?.data || []);
      setClassrooms(resClassrooms?.data || []);
    } catch (err) {
      setError("Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("type", formData.type);
      data.append("school", formData.school);
      if (formData.classroom) data.append("classroom", formData.classroom);
      data.append("author", user.id);
      if (file) data.append("file", file);

      await createCommunicationRequest(data);
      setFormData({ title: "", content: "", type: "communique", school: "", classroom: "" });
      setFile(null);
      fetchData();
    } catch (err) {
      setError("Erreur lors de la publication.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#F9AB00" }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            Communications
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Communiqués et Convocations pour les parents et élèves</p>
        </div>

        {/* Formulaire - Réservé Admin / Directeur / Prof */}
        {["super_admin", "admin", "director", "teacher"].includes(user?.role) && (
          <div style={{ 
            background: "transparent", 
            padding: "2rem", 
            borderRadius: "20px", 
            border: "3px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "3rem"
          }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Publier une nouvelle communication</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Titre</label>
                  <input 
                    placeholder="Ex: Réunion de parents" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                    required 
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Type</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})} 
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                  >
                    <option value="communique" style={{ background: "white", color: "#222" }}>Communiqué</option>
                    <option value="convocation" style={{ background: "white", color: "#222" }}>Convocation</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>École</label>
                  <select 
                    value={formData.school} 
                    onChange={e => setFormData({...formData, school: e.target.value})} 
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                    required
                  >
                    <option value="" style={{ background: "white", color: "#222" }}>Sélectionner l'école</option>
                    {schools.map(s => <option key={s._id} value={s._id} style={{ background: "white", color: "#222" }}>{s.name}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Classe (Optionnel)</label>
                  <select 
                    value={formData.classroom} 
                    onChange={e => setFormData({...formData, classroom: e.target.value})} 
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                  >
                    <option value="" style={{ background: "white", color: "#222" }}>Toute l'école</option>
                    {classrooms.map(c => <option key={c._id} value={c._id} style={{ background: "white", color: "#222" }}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Message</label>
                <textarea 
                  placeholder="Écrivez le message ici..." 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white", minHeight: "100px" }}
                  required 
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Fichier joint (Optionnel)</label>
                <input type="file" onChange={e => setFile(e.target.files[0])} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }} />
              </div>
              
              <button className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "0.8rem 2rem" }} disabled={saving}>
                {saving ? "Publication..." : "Publier"}
              </button>
            </form>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem" }}>Historique des communications</h2>
          <span style={{ opacity: 0.5 }}>{communications.length} messages</span>
        </div>

        {loading ? <Loader /> : (
          <div className="grid">
            {communications.length === 0 ? <p style={{ textAlign: "center", gridColumn: "1/-1" }}>Aucune communication.</p> : communications.map(c => (
              <div key={c._id} style={{ 
                background: "transparent", 
                padding: "1.5rem", 
                borderRadius: "15px", 
                border: "3px solid rgba(255, 255, 255, 0.1)",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ 
                    fontSize: "0.6rem", 
                    padding: "2px 8px", 
                    borderRadius: "4px", 
                    background: c.type === "convocation" ? "#ff5252" : "#0066cc",
                    textTransform: "uppercase",
                    fontWeight: "bold"
                  }}>
                    {c.type}
                  </span>
                  <span style={{ fontSize: "0.7rem", opacity: 0.4 }}>{formatDate(c.createdAt)}</span>
                </div>
                <h3 style={{ marginBottom: "0.8rem" }}>{c.title}</h3>
                <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "1rem", whiteSpace: "pre-wrap" }}>{c.content}</p>
                
                <div style={{ fontSize: "0.75rem", opacity: 0.5, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    {c.school?.name} 
                    {c.classroom ? (
                      <>
                        | <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        {c.classroom.name}
                      </>
                    ) : (
                      <>
                        | <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        Toute l'école
                      </>
                    )}
                  </span>
                  {["super_admin", "admin", "director", "teacher"].includes(user?.role) && (
                    <a 
                      href={`https://wa.me/?text=*${encodeURIComponent(c.type.toUpperCase())}: ${encodeURIComponent(c.title)}*%0A%0A${encodeURIComponent(c.content)}%0A%0A_Envoyé via Scolaris_`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "#25D366", 
                        color: "white", 
                        padding: "4px 10px", 
                        borderRadius: "5px", 
                        fontSize: "0.7rem", 
                        fontWeight: "bold",
                        textDecoration: "none"
                      }}
                    >
                      Partager WhatsApp
                    </a>
                  )}
                </div>

                {c.fileUrl && (
                  <div style={{ marginTop: "1rem" }}>
                    <a 
                      href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${c.fileUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: "var(--primary)", 
                        fontSize: "0.8rem", 
                        textDecoration: "underline",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                      Télécharger la pièce jointe
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
