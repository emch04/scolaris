import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getStudentsRequest, createStudentRequest } from "../services/student.api";
import { getSchoolsRequest } from "../services/school.api";
import { getClassroomsRequest } from "../services/classroom.api";
import { addStudentResultRequest } from "../services/result.api";
import formatDate from "../utils/formatDate";
import useAuth from "../hooks/useAuth";

function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Pour la saisie des notes
  const [showScoreForm, setShowScoreForm] = useState(null);
  const [scoreData, setScoreForm] = useState({
    subject: "",
    score: "",
    maxScore: 20,
    appreciation: "",
    period: "Trimestre 1"
  });

  // État du formulaire d'inscription
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "M",
    birthDate: "",
    parentName: "",
    parentPhone: "",
    school: "",
    classroom: ""
  });

  const fetchData = async () => {
    try {
      const [resStudents, resSchools, resClassrooms] = await Promise.all([
        getStudentsRequest(),
        getSchoolsRequest(),
        getClassroomsRequest()
      ]);
      setStudents(resStudents?.data || []);
      setSchools(resSchools?.data || []);
      setClassrooms(resClassrooms?.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createStudentRequest(formData);
      setFormData({
        fullName: "",
        gender: "M",
        birthDate: "",
        parentName: "",
        parentPhone: "",
        school: "",
        classroom: ""
      });
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de la création.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddScore = async (e, studentId) => {
    e.preventDefault();
    try {
      await addStudentResultRequest({
        ...scoreData,
        student: studentId,
        teacher: user.id
      });
      alert("Note ajoutée avec succès !");
      setShowScoreForm(null);
      setScoreForm({ subject: "", score: "", maxScore: 20, appreciation: "", period: "Trimestre 1" });
    } catch (err) {
      alert("Erreur lors de l'ajout de la note.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#34A853" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Gestion des Élèves
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Inscrivez et gérez le suivi des élèves du réseau</p>
        </div>

        {/* Formulaire d'inscription épuré */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.03)", 
          padding: "2rem", 
          borderRadius: "20px", 
          border: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: "3rem"
        }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Inscrire un nouvel élève</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Nom complet</label>
                <input type="text" name="fullName" placeholder="Ex: Jean Mukendi" value={formData.fullName} onChange={handleChange} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }} required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Genre</label>
                <select name="gender" value={formData.gender} onChange={handleChange} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}>
                  <option value="M" style={{ background: "#222" }}>Masculin</option>
                  <option value="F" style={{ background: "#222" }}>Féminin</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Date de naissance</label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Nom du parent</label>
                <input type="text" name="parentName" placeholder="Ex: Marie Kabange" value={formData.parentName} onChange={handleChange} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Téléphone parent</label>
                <input type="text" name="parentPhone" placeholder="Ex: +243..." value={formData.parentPhone} onChange={handleChange} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Établissement</label>
                <select name="school" value={formData.school} onChange={handleChange} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }} required>
                  <option value="" style={{ background: "#222" }}>Sélectionner une école</option>
                  {schools.map(s => <option key={s._id} value={s._id} style={{ background: "#222" }}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Classe</label>
                <select name="classroom" value={formData.classroom} onChange={handleChange} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }} required>
                  <option value="" style={{ background: "#222" }}>Sélectionner une classe</option>
                  {classrooms.map(c => <option key={c._id} value={c._id} style={{ background: "#222" }}>{c.name} ({c.level})</option>)}
                </select>
              </div>
            </div>
            {error && <p style={{ color: "#ff5252", fontSize: "0.9rem" }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "0.8rem 2rem" }} disabled={saving}>
              {saving ? "Enregistrement..." : "Inscrire l'élève"}
            </button>
          </form>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem" }}>Élèves inscrits</h2>
          <span style={{ opacity: 0.5, fontSize: "0.9rem" }}>{students.length} élèves au total</span>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><Loader /></div>
        ) : (
          <div className="grid">
            {students.length === 0 ? (
              <p style={{ textAlign: "center", gridColumn: "1/-1", padding: "3rem", opacity: 0.5 }}>Aucun élève trouvé.</p>
            ) : (
              students.map(s => (
                <div key={s._id} style={{ 
                  background: "rgba(255, 255, 255, 0.05)", 
                  padding: "1.5rem", 
                  borderRadius: "15px", 
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "bold", marginBottom: "0.5rem" }}>{s.matricule}</div>
                  <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>{s.fullName}</h3>
                  <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                    <p>📚 <strong>Classe:</strong> {s.classroom?.name || "N/A"}</p>
                    <p style={{ marginTop: "0.4rem" }}>👤 <strong>Parent:</strong> {s.parentName || "N/A"}</p>
                    <p style={{ marginTop: "0.4rem" }}>📞 <strong>Tél:</strong> {s.parentPhone || "Non renseigné"}</p>
                    {s.birthDate && <p style={{ marginTop: "0.4rem", fontSize: "0.8rem" }}>🎂 Né(e) le {formatDate(s.birthDate)}</p>}
                  </div>

                  <div style={{ 
                    marginTop: "1.5rem", 
                    paddingTop: "1rem", 
                    borderTop: "1px solid rgba(255,255,255,0.1)" 
                  }}>
                    <p style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: "bold", 
                      color: "#34A853", 
                      marginBottom: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}>
                      Actions
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <a 
                        href={s.parentPhone ? `https://wa.me/${s.parentPhone.replace(/\s+/g, '')}` : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          background: s.parentPhone ? "#25D366" : "#333", 
                          color: "white", 
                          padding: "0.7rem", 
                          borderRadius: "8px", 
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                          textDecoration: "none",
                          opacity: s.parentPhone ? 1 : 0.3
                        }}
                      >
                        WhatsApp
                      </a>
                      <button 
                        onClick={() => setShowScoreForm(showScoreForm === s._id ? null : s._id)}
                        style={{ 
                          flex: 1,
                          background: "#34A853", 
                          color: "white", 
                          border: "none",
                          padding: "0.7rem", 
                          borderRadius: "8px", 
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                          cursor: "pointer"
                        }}
                      >
                        📝 Note
                      </button>
                    </div>

                    {showScoreForm === s._id && (
                      <form onSubmit={(e) => handleAddScore(e, s._id)} style={{ 
                        marginTop: "15px", 
                        background: "rgba(0,0,0,0.3)", 
                        padding: "15px", 
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                      }}>
                        <input 
                          placeholder="Matière" 
                          value={scoreData.subject}
                          onChange={e => setScoreForm({...scoreData, subject: e.target.value})}
                          style={{ background: "#222", border: "1px solid #444", color: "white", padding: "8px", fontSize: "0.8rem", borderRadius: "5px" }}
                          required
                        />
                        <div style={{ display: "flex", gap: "5px" }}>
                          <input 
                            type="number"
                            placeholder="Note" 
                            value={scoreData.score}
                            onChange={e => setScoreForm({...scoreData, score: e.target.value})}
                            style={{ flex: 1, background: "#222", border: "1px solid #444", color: "white", padding: "8px", fontSize: "0.8rem", borderRadius: "5px" }}
                            required
                          />
                          <input 
                            type="number"
                            placeholder="Max" 
                            value={scoreData.maxScore}
                            onChange={e => setScoreForm({...scoreData, maxScore: e.target.value})}
                            style={{ width: "60px", background: "#222", border: "1px solid #444", color: "white", padding: "8px", fontSize: "0.8rem", borderRadius: "5px" }}
                            required
                          />
                        </div>
                        <select 
                          value={scoreData.period}
                          onChange={e => setScoreForm({...scoreData, period: e.target.value})}
                          style={{ background: "#222", border: "1px solid #444", color: "white", padding: "8px", fontSize: "0.8rem", borderRadius: "5px" }}
                        >
                          <option value="Trimestre 1">Trimestre 1</option>
                          <option value="Trimestre 2">Trimestre 2</option>
                          <option value="Trimestre 3">Trimestre 3</option>
                          <option value="Examen État">Examen État</option>
                        </select>
                        <button type="submit" className="btn btn-primary" style={{ padding: "8px", fontSize: "0.8rem" }}>Enregistrer</button>
                      </form>
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

export default StudentsPage;
