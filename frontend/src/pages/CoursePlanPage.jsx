import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getCoursePlansRequest, addCoursePlanRequest } from "../services/courseplan.api";
import { getClassroomsRequest } from "../services/classroom.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";

function CoursePlanPage() {
  const { classroomId } = useParams();
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(classroomId || "");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ subject: "", content: "", year: "2023-2024" });

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
    try {
      await addCoursePlanRequest({ ...formData, classroom: selectedClass });
      showToast("Plan de cours publié !");
      setShowForm(false);
      fetchPlans(selectedClass);
    } catch (err) {
      showToast("Erreur lors de la publication.", "error");
    }
  };

  if (user?.role === "super_admin") return <><Navbar /><div className="container" style={{ textAlign: "center", padding: "5rem" }}>Accès refusé. Le Super Admin ne gère pas les plans de cours.</div></>;

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

        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <select 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
            style={{ width: "300px", padding: "12px", borderRadius: "10px", background: "white", color: "#222" }}
          >
            <option value="">Choisir une classe</option>
            {classrooms.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          {user?.role === "teacher" && selectedClass && (
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
              {showForm ? "Annuler" : "Publier un plan"}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.03)", padding: "2rem", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "3rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input type="text" placeholder="Matière" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} style={{ padding: "10px", borderRadius: "8px" }} required />
              <input type="text" placeholder="Année Scolaire" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} style={{ padding: "10px", borderRadius: "8px" }} required />
            </div>
            <textarea placeholder="Description détaillée du programme annuel..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} style={{ padding: "10px", borderRadius: "8px", minHeight: "150px" }} required />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "0.8rem 2rem" }}>Publier</button>
          </form>
        )}

        {loading ? <Loader /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {plans.length > 0 ? plans.map(p => (
              <div key={p._id} style={{ 
                background: "transparent", 
                padding: "2rem", 
                borderRadius: "20px", 
                border: "3px solid rgba(255, 255, 255, 0.1)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <h3 style={{ color: "var(--primary)", fontSize: "1.4rem" }}>{p.subject} ({p.year})</h3>
                  <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>Par {p.teacher?.fullName}</span>
                </div>
                <div style={{ whiteSpace: "pre-wrap", opacity: 0.8, lineHeight: "1.8" }}>{p.content}</div>
              </div>
            )) : selectedClass && <p style={{ textAlign: "center", opacity: 0.3, padding: "4rem" }}>Aucun plan de cours publié pour cette classe.</p>}
          </div>
        )}
      </main>
    </>
  );
}

export default CoursePlanPage;
