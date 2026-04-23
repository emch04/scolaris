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
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
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

        {/* Mini Tableau de Bord */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
          <div style={{ 
            background: "rgba(52, 168, 83, 0.1)", 
            border: "1px solid #34A853", 
            padding: "1rem 2rem", 
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#34A853" }}>{students.length}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", opacity: 0.7 }}>Élèves</div>
              <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>Effectif total actuel</div>
            </div>
          </div>
        </div>
{/* Formulaire d'inscription épuré - Masqué pour le Super Admin */}
{user?.role !== "super_admin" && (
  <div style={{ 
    background: "transparent", 
    padding: "2rem", 
    borderRadius: "20px", 
    border: "3px solid rgba(255, 255, 255, 0.1)",
    marginBottom: "3rem"
  }}>
    <h3 style={{ marginBottom: "1.5rem" }}>Inscrire un nouvel élève</h3>
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Nom complet</label>
          <input type="text" name="fullName" placeholder="Ex: Jean Mukendi" value={formData.fullName} onChange={handleChange} style={{ background: "white", border: "2px solid #ccc", padding: "0.8rem", borderRadius: "8px", color: "#222" }} required />
        </div>
...
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Sexe</label>
                <select name="gender" value={formData.gender} onChange={handleChange} style={{ background: "white", border: "2px solid #ccc", padding: "0.8rem", borderRadius: "8px", color: "#222", cursor: "pointer" }} required>
                  <option value="M" style={{ background: "white", color: "#222" }}>Masculin</option>
                  <option value="F" style={{ background: "white", color: "#222" }}>Féminin</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Date de naissance</label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} style={{ background: "white", border: "2px solid #ccc", padding: "0.8rem", borderRadius: "8px", color: "#222" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Nom du parent</label>
                <input type="text" name="parentName" placeholder="Ex: Marie Kabange" value={formData.parentName} onChange={handleChange} style={{ background: "white", border: "2px solid #ccc", padding: "0.8rem", borderRadius: "8px", color: "#222" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Téléphone parent</label>
                <input type="text" name="parentPhone" placeholder="Ex: +243..." value={formData.parentPhone} onChange={handleChange} style={{ background: "white", border: "2px solid #ccc", padding: "0.8rem", borderRadius: "8px", color: "#222" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Établissement</label>
                <select name="school" value={formData.school} onChange={handleChange} style={{ background: "white", border: "2px solid #ccc", padding: "0.8rem", borderRadius: "8px", color: "#222", cursor: "pointer" }} required>
                  <option value="" style={{ background: "white", color: "#222" }}>Sélectionner une école</option>
                  {schools.map(s => <option key={s._id} value={s._id} style={{ background: "white", color: "#222" }}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", opacity: 0.7 }}>Classe</label>
                <select name="classroom" value={formData.classroom} onChange={handleChange} style={{ background: "white", border: "2px solid #ccc", padding: "0.8rem", borderRadius: "8px", color: "#222", cursor: "pointer" }} required>
                  <option value="" style={{ background: "white", color: "#222" }}>Sélectionner une classe</option>
                  {classrooms.map(c => <option key={c._id} value={c._id} style={{ background: "white", color: "#222" }}>{c.name} ({c.level})</option>)}
                </select>
              </div>            </div>
            {error && <p style={{ color: "#ff5252", fontSize: "0.9rem" }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "0.8rem 2rem" }} disabled={saving}>
              {saving ? "Enregistrement..." : "Inscrire l'élève"}
            </button>
          </form>
        </div>
      )}

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
                  background: "transparent", 
                  padding: "1.5rem", 
                  borderRadius: "15px", 
                  border: "3px solid rgba(255, 255, 255, 0.1)"
                }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "bold", marginBottom: "0.5rem" }}>{s.matricule}</div>
                  <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>{s.fullName}</h3>
                  <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                    <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                      <strong>Classe:</strong> {s.classroom?.name || "N/A"}
                    </p>
                    <p style={{ marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <strong>Parent:</strong> {s.parentName || "N/A"}
                    </p>
                    <p style={{ marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      <strong>Tél:</strong> {s.parentPhone || "Non renseigné"}
                    </p>
                    {s.birthDate && (
                      <p style={{ marginTop: "0.4rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        Né(e) le {formatDate(s.birthDate)}
                      </p>
                    )}
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
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                        Note
                      </button>
                    </div>

                    {showScoreForm === s._id && (
                      <form onSubmit={(e) => handleAddScore(e, s._id)} style={{ 
                        marginTop: "20px", 
                        background: "rgba(255,255,255,0.05)", 
                        padding: "20px", 
                        borderRadius: "15px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                      }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "5px", color: "var(--primary)" }}>SAISIE DES NOTES</div>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                          <label style={{ fontSize: "0.75rem", opacity: 0.6 }}>Matière</label>
                          <input 
                            placeholder="Ex: Français" 
                            value={scoreData.subject}
                            onChange={e => setScoreForm({...scoreData, subject: e.target.value})}
                            style={{ background: "white", color: "#222", border: "1px solid #ccc", padding: "10px", fontSize: "0.9rem", borderRadius: "8px" }}
                            required
                          />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            <label style={{ fontSize: "0.75rem", opacity: 0.6 }}>Note obtenue</label>
                            <input 
                              type="number"
                              placeholder="0.0" 
                              value={scoreData.score}
                              onChange={e => setScoreForm({...scoreData, score: e.target.value})}
                              style={{ background: "white", color: "#222", border: "1px solid #ccc", padding: "10px", fontSize: "0.9rem", borderRadius: "8px" }}
                              required
                            />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            <label style={{ fontSize: "0.75rem", opacity: 0.6 }}>Total Max</label>
                            <input 
                              type="number"
                              placeholder="20" 
                              value={scoreData.maxScore}
                              onChange={e => setScoreForm({...scoreData, maxScore: e.target.value})}
                              style={{ background: "white", color: "#222", border: "1px solid #ccc", padding: "10px", fontSize: "0.9rem", borderRadius: "8px" }}
                              required
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                          <label style={{ fontSize: "0.75rem", opacity: 0.6 }}>Période d'évaluation</label>
                          <select 
                            value={scoreData.period}
                            onChange={e => setScoreForm({...scoreData, period: e.target.value})}
                            style={{ background: "white", color: "#222", border: "1px solid #ccc", padding: "10px", fontSize: "0.9rem", borderRadius: "8px" }}
                          >
                            <option value="Trimestre 1">Premier Trimestre</option>
                            <option value="Trimestre 2">Deuxième Trimestre</option>
                            <option value="Trimestre 3">Troisième Trimestre</option>
                            <option value="Examen État">Examen d'État / Jury</option>
                          </select>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                          <label style={{ fontSize: "0.75rem", opacity: 0.6 }}>Appréciation (Optionnel)</label>
                          <input 
                            placeholder="Ex: Très bon travail" 
                            value={scoreData.appreciation}
                            onChange={e => setScoreForm({...scoreData, appreciation: e.target.value})}
                            style={{ background: "white", color: "#222", border: "1px solid #ccc", padding: "10px", fontSize: "0.9rem", borderRadius: "8px" }}
                          />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: "5px", padding: "12px", fontSize: "0.85rem", fontWeight: "bold" }}>
                          ENREGISTRER LA NOTE
                        </button>
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
