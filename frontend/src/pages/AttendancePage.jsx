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

function AttendancePage() {
  const { studentId } = useParams();
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: "present" | "absent" | "late" }
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { showToast } = useToast();

  useEffect(() => {
    if (studentId) {
      // Vue Parent/Élève : Historique
      getStudentAttendanceRequest(studentId)
        .then(res => setHistory(res?.data || []))
        .finally(() => setLoading(false));
    } else {
      // Vue Staff : Faire l'appel
      getClassroomsRequest()
        .then(res => setClassrooms(res?.data || []))
        .finally(() => setLoading(false));
    }
  }, [studentId]);

  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    if (!classId) {
      setStudents([]);
      return;
    }

    setLoading(true);
    try {
      // 1. Charger les élèves de la classe
      const resStudents = await getStudentsRequest();
      const filtered = resStudents?.data?.filter(s => s.classroom?._id === classId || s.classroom === classId) || [];
      setStudents(filtered);

      // 2. Charger les présences existantes pour cette date
      const resAttendance = await getClassroomAttendanceRequest(classId, date);
      const existing = {};
      resAttendance?.data?.forEach(record => {
        existing[record.student._id || record.student] = record.status;
      });
      
      // Initialiser avec les présences existantes ou "present" par défaut
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

        {!studentId && (
          <div style={{ 
            background: "rgba(255,255,255,0.03)", 
            padding: "1.5rem", 
            borderRadius: "20px", 
            border: "3px solid rgba(255,255,255,0.1)",
            marginBottom: "2rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "flex-end"
          }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>Classe</label>
              <select 
                value={selectedClass} 
                onChange={e => handleClassChange(e.target.value)}
                style={{ width: "100%", background: "white", color: "#222", padding: "10px", borderRadius: "10px", border: "none" }}
              >
                <option value="">Choisir une classe</option>
                {classrooms.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ width: "200px" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                style={{ width: "100%", background: "white", color: "#222", padding: "10px", borderRadius: "10px", border: "none" }}
              />
            </div>
          </div>
        )}

        {loading ? <Loader /> : (
          studentId ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {history.length > 0 ? history.map(h => (
                <div key={h._id} style={{ 
                  background: "rgba(255,255,255,0.03)", 
                  padding: "1.2rem", 
                  borderRadius: "15px", 
                  border: `1px solid ${h.status === 'absent' ? '#ff5252' : h.status === 'late' ? '#F9AB00' : 'rgba(255,255,255,0.05)'}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontWeight: "bold", textTransform: "capitalize" }}>{h.status}</div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.5 }}>{formatDate(h.date)} • Par {h.teacher?.fullName}</div>
                  </div>
                  {h.reason && <div style={{ fontSize: "0.85rem", fontStyle: "italic", opacity: 0.7 }}>Motif: {h.reason}</div>}
                </div>
              )) : (
                <p style={{ textAlign: "center", opacity: 0.5, padding: "3rem" }}>Aucun historique de présence disponible.</p>
              )}
            </div>
          ) : (
            students.length > 0 ? (
              <div style={{ 
                background: "rgba(255,255,255,0.03)", 
                borderRadius: "20px", 
                border: "3px solid rgba(255,255,255,0.1)",
                overflow: "hidden"
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.05)", textAlign: "left" }}>
                      <th style={{ padding: "1.2rem" }}>Élève</th>
                      <th style={{ padding: "1.2rem", textAlign: "center" }}>Présent</th>
                      <th style={{ padding: "1.2rem", textAlign: "center" }}>Absent</th>
                      <th style={{ padding: "1.2rem", textAlign: "center" }}>Retard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s._id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "1.2rem" }}>
                          <div style={{ fontWeight: "bold" }}>{s.fullName}</div>
                          <div style={{ fontSize: "0.7rem", opacity: 0.4 }}>{s.matricule}</div>
                        </td>
                        <td style={{ padding: "1.2rem", textAlign: "center" }}>
                          <input type="radio" name={`status-${s._id}`} checked={attendance[s._id] === "present"} onChange={() => handleStatusChange(s._id, "present")} style={{ width: "20px", height: "20px", accentColor: "#34A853" }} />
                        </td>
                        <td style={{ padding: "1.2rem", textAlign: "center" }}>
                          <input type="radio" name={`status-${s._id}`} checked={attendance[s._id] === "absent"} onChange={() => handleStatusChange(s._id, "absent")} style={{ width: "20px", height: "20px", accentColor: "#ff5252" }} />
                        </td>
                        <td style={{ padding: "1.2rem", textAlign: "center" }}>
                          <input type="radio" name={`status-${s._id}`} checked={attendance[s._id] === "late"} onChange={() => handleStatusChange(s._id, "late")} style={{ width: "20px", height: "20px", accentColor: "#F9AB00" }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "1.5rem", textAlign: "right", background: "rgba(255,255,255,0.02)" }}>
                  <button 
                    onClick={handleSubmit} 
                    disabled={saving}
                    className="btn btn-primary" 
                    style={{ padding: "0.8rem 2.5rem" }}
                  >
                    {saving ? "Enregistrement..." : "Enregistrer l'appel"}
                  </button>
                </div>
              </div>
            ) : selectedClass && (
              <p style={{ textAlign: "center", opacity: 0.5, padding: "3rem" }}>Aucun élève trouvé dans cette classe.</p>
            )
          )
        )}
      </main>
    </>
  );
}

export default AttendancePage;
