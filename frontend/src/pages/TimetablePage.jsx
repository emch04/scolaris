/**
 * @file TimetablePage.jsx
 * @description Page d'affichage et de gestion de l'emploi du temps scolaire.
 */

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getClassroomsRequest } from "../services/classroom.api";
import { getClassroomTimetableRequest, addTimetableEntryRequest, deleteTimetableEntryRequest } from "../services/timetable.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function TimetablePage() {
  const { user } = useAuth();
  const { classroomId } = useParams();
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(classroomId || "");
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { showToast } = useToast();
  const timetableRef = useRef();

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

  const handleDownloadPDF = async () => {
    if (!selectedClass) return;
    setPrinting(true);
    setTimeout(async () => {
      try {
        const element = timetableRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#050505"
        });
        const imgData = canvas.toDataURL("image/png");
        
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        const className = classrooms.find(c => c._id === selectedClass)?.name || "Classe";
        pdf.save(`Emploi_du_temps_${className.replace(/\s+/g, '_')}.pdf`);
      } catch (err) {
        console.error("Erreur PDF:", err);
        showToast("Erreur lors de la génération du PDF.", "error");
      } finally {
        setPrinting(false);
      }
    }, 100);
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
      <main className="container" style={{ padding: "1.5rem" }}>
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 6vw, 2.5rem)", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Emploi du Temps
          </h1>
          <p style={{ opacity: 0.6, fontSize: "0.95rem" }}>Consultez et gérez les horaires par classe</p>
        </div>

        <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap", width: "100%" }}>
            <select 
              value={selectedClass} 
              onChange={e => handleClassChange(e.target.value)}
              style={{ flex: "1", minWidth: "200px", background: "white", color: "#222", padding: "10px", borderRadius: "10px", border: "none", fontSize: "0.9rem" }}
            >
              <option value="">Choisir une classe</option>
              {classrooms.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>

            {selectedClass && (
              <button 
                onClick={handleDownloadPDF} 
                disabled={printing || timetable.length === 0}
                className="btn"
                style={{ background: "rgba(255,255,255,0.1)", color: "white", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", padding: "10px 15px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span className="hide-on-mobile">{printing ? "Export..." : "Exporter PDF"}</span>
              </button>
            )}
            
            {["admin", "director", "super_admin", "teacher"].includes(user?.role) && selectedClass && (
              <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary" style={{ padding: "10px 15px", fontSize: "0.85rem" }}>
                {showAddForm ? "Annuler" : "Ajouter"}
              </button>
            )}
          </div>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="form" style={{ 
            marginBottom: "2rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.8rem",
            alignItems: "flex-end",
            maxWidth: "100%",
            padding: "1.2rem"
          }}>
            <div>
              <label style={{ fontSize: "0.75rem", opacity: 0.7 }}>Jour</label>
              <select value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} style={{ padding: "8px", fontSize: "0.85rem" }}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", opacity: 0.7 }}>Matière</label>
              <input 
                type="text" 
                list="subjects-list"
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})} 
                placeholder="Ex: Informatique" 
                style={{ padding: "8px", fontSize: "0.85rem" }}
                required 
              />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", opacity: 0.7 }}>Début</label>
              <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} style={{ padding: "8px", fontSize: "0.85rem" }} required />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", opacity: 0.7 }}>Fin</label>
              <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} style={{ padding: "8px", fontSize: "0.85rem" }} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: "10px", fontSize: "0.85rem" }}>Enregistrer</button>
          </form>
        )}

        {loading ? <Loader /> : (
          selectedClass ? (
            <div ref={timetableRef} style={{ padding: printing ? "40px" : "0", background: printing ? "#050505" : "transparent" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(250px, 45vw, 350px), 1fr))", gap: "1rem" }}>
                {days.map(day => (
                  <div key={day} style={{ 
                    background: "rgba(255,255,255,0.03)", 
                    padding: "1.2rem", 
                    borderRadius: "15px", 
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}>
                    <h3 style={{ color: "var(--primary)", fontSize: "1.1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px", marginBottom: "0.8rem" }}>{day}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {timetable.filter(t => t.day === day).length > 0 ? (
                        timetable.filter(t => t.day === day).map(item => (
                          <div key={item._id} style={{ 
                            background: "rgba(255,255,255,0.02)", 
                            padding: "0.8rem", 
                            borderRadius: "10px", 
                            display: "flex", 
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}>
                            <div>
                              <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{item.subject}</div>
                              <div style={{ fontSize: "0.75rem", opacity: 0.5 }}>{item.startTime} - {item.endTime}</div>
                            </div>
                            {["admin", "director", "super_admin", "teacher"].includes(user?.role) && !printing && (
                              <button onClick={() => handleDelete(item._id)} style={{ background: "none", border: "none", color: "#ff5252", cursor: "pointer", padding: "5px" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: "0.75rem", opacity: 0.3 }}>Libre</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem", opacity: 0.3 }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>Sélectionnez une classe pour voir l'emploi du temps</p>
            </div>
          )
        )}
      </main>
    </>
  );
}

export default TimetablePage;
