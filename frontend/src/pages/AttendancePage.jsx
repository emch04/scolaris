/**
 * @file AttendancePage.jsx
 * @description Page de gestion des présences (appels) pour une classe donnée.
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getStudentsRequest } from "../services/student.api";
import { getClassroomsRequest } from "../services/classroom.api";
import { markAttendanceRequest, getClassroomAttendanceRequest, getStudentAttendanceRequest } from "../services/attendance.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";
import formatDate from "../utils/formatDate";

/**
 * AttendancePage.jsx
 * Rôle : Gestion du pointage quotidien (Appel) et suivi de l'assiduité.
 * Double fonctionnalité : 
 * 1. Vue Staff : Marquer les présences pour une classe et une date donnée.
 * 2. Vue Parent/Élève : Consulter l'historique des absences et retards.
 */
function AttendancePage() {
  const { studentId } = useParams();
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // État local des présences : { studentId: "present" | "absent" | "late" }
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { showToast } = useToast();

  /**
   * useEffect : Logique de branchement selon le contexte.
   * - Si studentId est présent : Récupère l'historique d'un élève.
   * - Sinon : Récupère la liste des classes pour faire l'appel.
   */
  useEffect(() => {
    if (studentId) {
      getStudentAttendanceRequest(studentId)
        .then(res => setHistory(res?.data || []))
        .finally(() => setLoading(false));
    } else {
      getClassroomsRequest(1, 100) // On récupère jusqu'à 100 classes
        .then(res => setClassrooms(res?.data?.classrooms || res?.data || []))
        .finally(() => setLoading(false));
    }
  }, [studentId]);

  /**
   * handleClassChange
   * Logique : Charge les élèves de la classe sélectionnée ET les présences déjà enregistrées 
   * pour la date choisie (permet la modification d'un appel déjà fait).
   */
  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    if (!classId) {
      setStudents([]);
      return;
    }

    setLoading(true);
    try {
      // Pour l'appel, on récupère une liste complète (ex: 100 élèves)
      const resStudents = await getStudentsRequest(1, 100);
      const allStudents = resStudents?.data?.students || resStudents?.data || [];
      const filtered = allStudents.filter(s => (s.classroom?._id || s.classroom) === classId) || [];
      setStudents(filtered);

      const resAttendance = await getClassroomAttendanceRequest(classId, date);
      const existing = {};
      resAttendance?.data?.forEach(record => {
        existing[record.student._id || record.student] = record.status;
      });
      
      const initialAttendance = {};
      filtered.forEach(s => {
        initialAttendance[s._id] = existing[s._id] || "present";
      });
      setAttendance(initialAttendance);
    } catch (err) {
      showToast("Erreur de chargement.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  /**
   * handleSubmit
   * Logique : Envoie la liste complète des statuts de présence pour la classe au serveur.
   */
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const attendanceList = Object.entries(attendance).map(([studentId, status]) => ({
        student: studentId,
        status
      }));

      await markAttendanceRequest({
        classroom: selectedClass,
        date,
        attendanceList
      });
      showToast("Appel enregistré avec succès !");
    } catch (err) {
      showToast("Erreur lors de l'enregistrement.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {studentId ? "Suivi des Présences" : "Feuille de Présence"}
          </h1>
          <p style={{ opacity: 0.6 }}>{studentId ? "Consultez l'historique des absences et retards" : "Sélectionnez une classe et marquez les absences du jour"}</p>
        </div>

        {/* Sélecteurs (Vue Staff uniquement) */}
        {!studentId && (
          <div style={{ 
            background: "rgba(255,255,255,0.03)", 
            padding: "1rem", 
            borderRadius: "15px", 
            border: "1px solid rgba(255, 255, 255, 0.12)",
            marginBottom: "1.5rem",
            display: "flex",
            gap: "0.8rem",
            flexWrap: "wrap",
            alignItems: "flex-end"
          }}>
            <div style={{ flex: "1 1 250px" }}>
              <label style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "6px", display: "block" }}>Classe</label>
              <select 
                value={selectedClass} 
                onChange={e => handleClassChange(e.target.value)}
                style={{ width: "100%", background: "white", color: "#222", padding: "10px", borderRadius: "8px", border: "none", fontSize: "0.9rem" }}
              >
                <option value="">Choisir une classe</option>
                {classrooms.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "6px", display: "block" }}>Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                style={{ width: "100%", background: "white", color: "#222", padding: "10px", borderRadius: "8px", border: "none", fontSize: "0.9rem" }}
              />
            </div>
          </div>
        )}

        {loading ? <Loader /> : (
          studentId ? (
            /* Affichage de l'historique pour Parent/Élève */
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {history.length > 0 ? history.map(h => (
                <div key={h._id} style={{ 
                  background: "rgba(255,255,255,0.03)", 
                  padding: "1rem", 
                  borderRadius: "12px", 
                  border: `1px solid ${h.status === 'absent' ? '#ff5252' : h.status === 'late' ? '#F9AB00' : 'rgba(255,255,255,0.05)'}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px"
                }}>
                  <div>
                    <div style={{ fontWeight: "bold", textTransform: "capitalize", fontSize: "0.95rem" }}>{h.status}</div>
                    <div style={{ fontSize: "0.75rem", opacity: 0.5 }}>{formatDate(h.date)} • Par {h.teacher?.fullName}</div>
                  </div>
                  {h.reason && <div style={{ fontSize: "0.8rem", fontStyle: "italic", opacity: 0.7 }}>Motif: {h.reason}</div>}
                </div>
              )) : (
                <p style={{ textAlign: "center", opacity: 0.5, padding: "2rem" }}>Aucun historique de présence disponible.</p>
              )}
            </div>
          ) : (
            /* Tableau de pointage pour le Staff */
            students.length > 0 ? (
              <div style={{ 
                background: "rgba(255,255,255,0.03)", 
                borderRadius: "15px", 
                border: "1px solid rgba(255, 255, 255, 0.12)",
                overflow: "hidden"
              }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.05)", textAlign: "left" }}>
                        <th style={{ padding: "1rem" }}>Élève</th>
                        <th style={{ padding: "1rem", textAlign: "center" }}>Présent</th>
                        <th style={{ padding: "1rem", textAlign: "center" }}>Absent</th>
                        <th style={{ padding: "1rem", textAlign: "center" }}>Retard</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s._id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "1rem" }}>
                            <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>{s.fullName}</div>
                            <div style={{ fontSize: "0.65rem", opacity: 0.4 }}>{s.matricule}</div>
                          </td>
                          <td style={{ padding: "1rem", textAlign: "center" }}>
                            <input type="radio" name={`status-${s._id}`} checked={attendance[s._id] === "present"} onChange={() => handleStatusChange(s._id, "present")} style={{ width: "18px", height: "18px", accentColor: "#34A853" }} />
                          </td>
                          <td style={{ padding: "1rem", textAlign: "center" }}>
                            <input type="radio" name={`status-${s._id}`} checked={attendance[s._id] === "absent"} onChange={() => handleStatusChange(s._id, "absent")} style={{ width: "18px", height: "18px", accentColor: "#ff5252" }} />
                          </td>
                          <td style={{ padding: "1rem", textAlign: "center" }}>
                            <input type="radio" name={`status-${s._id}`} checked={attendance[s._id] === "late"} onChange={() => handleStatusChange(s._id, "late")} style={{ width: "18px", height: "18px", accentColor: "#F9AB00" }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: "1.2rem", textAlign: "right", background: "rgba(255,255,255,0.02)" }}>
                  <button 
                    onClick={handleSubmit} 
                    disabled={saving}
                    className="btn btn-primary" 
                    style={{ padding: "0.8rem 2rem", width: "100%", maxWidth: "250px" }}
                  >
                    {saving ? "Enregistrement..." : "Enregistrer l'appel"}
                  </button>
                </div>
              </div>
            ) : selectedClass && (
              <p style={{ textAlign: "center", opacity: 0.5, padding: "2rem" }}>Aucun élève trouvé.</p>
            )
          )
        )}
      </main>
    </>
  );
}

export default AttendancePage;
