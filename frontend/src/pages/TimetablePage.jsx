import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getClassroomsRequest } from "../services/classroom.api";
import { getClassroomTimetableRequest, addTimetableEntryRequest, deleteTimetableEntryRequest } from "../services/timetable.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";

function TimetablePage() {
  const { user } = useAuth();
  const { classroomId } = useParams();
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(classroomId || "");
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { showToast } = useToast();

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const [formData, setFormData] = useState({
    day: "Lundi",
    startTime: "08:00",
    endTime: "10:00",
    subject: "",
    teacher: user?.id
  });

  useEffect(() => {
    getClassroomsRequest()
      .then(res => {
        setClassrooms(res?.data || []);
        if (classroomId) fetchTimetable(classroomId);
      })
      .finally(() => setLoading(false));
  }, [classroomId]);

  const fetchTimetable = (classId) => {
    if (!classId) return;
    setLoading(true);
    getClassroomTimetableRequest(classId)
      .then(res => setTimetable(res?.data || []))
      .catch(() => showToast("Erreur de chargement.", "error"))
      .finally(() => setLoading(false));
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    fetchTimetable(classId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTimetableEntryRequest({ ...formData, classroom: selectedClass });
      showToast("Cours ajouté !");
      setShowAddForm(false);
      fetchTimetable(selectedClass);
    } catch (err) {
      showToast("Erreur lors de l'ajout.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce cours ?")) return;
    try {
      await deleteTimetableEntryRequest(id);
      showToast("Cours supprimé.");
      fetchTimetable(selectedClass);
    } catch (err) {
      showToast("Erreur lors de la suppression.", "error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Emploi du Temps
          </h1>
          <p style={{ opacity: 0.6 }}>Consultez et gérez les horaires par classe</p>
        </div>

        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <select 
            value={selectedClass} 
            onChange={e => handleClassChange(e.target.value)}
            style={{ width: "300px", background: "white", color: "#222", padding: "12px", borderRadius: "10px", border: "none" }}
          >
            <option value="">Choisir une classe</option>
            {classrooms.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          {["admin", "director", "super_admin", "teacher"].includes(user?.role) && selectedClass && (
            <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
              {showAddForm ? "Annuler" : "Ajouter un cours"}
            </button>
          )}
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="form" style={{ 
            marginBottom: "2rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
            alignItems: "flex-end",
            maxWidth: "100%"
          }}>
            <div>
              <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Jour</label>
              <select value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Matière</label>
              <input 
                type="text" 
                list="subjects-list"
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})} 
                placeholder="Ex: Informatique" 
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
              <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Début</label>
              <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Fin</label>
              <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary">Enregistrer</button>
          </form>
        )}

        {loading ? <Loader /> : (
          selectedClass ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {days.map(day => (
                <div key={day} style={{ 
                  background: "rgba(255,255,255,0.03)", 
                  padding: "1.5rem", 
                  borderRadius: "20px", 
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <h3 style={{ color: "var(--primary)", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px", marginBottom: "1rem" }}>{day}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {timetable.filter(t => t.day === day).length > 0 ? (
                      timetable.filter(t => t.day === day).map(item => (
                        <div key={item._id} style={{ 
                          background: "rgba(255,255,255,0.02)", 
                          padding: "1rem", 
                          borderRadius: "12px", 
                          display: "flex", 
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <div>
                            <div style={{ fontWeight: "bold" }}>{item.subject}</div>
                            <div style={{ fontSize: "0.8rem", opacity: 0.5 }}>{item.startTime} - {item.endTime}</div>
                          </div>
                          {["admin", "director", "super_admin", "teacher"].includes(user?.role) && (
                            <button onClick={() => handleDelete(item._id)} style={{ background: "none", border: "none", color: "#ff5252", cursor: "pointer" }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p style={{ fontSize: "0.8rem", opacity: 0.3 }}>Aucun cours prévu.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem", opacity: 0.3 }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <p style={{ marginTop: "1rem" }}>Sélectionnez une classe pour voir l'emploi du temps</p>
            </div>
          )
        )}
      </main>
    </>
  );
}

export default TimetablePage;
