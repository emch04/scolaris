import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getCalendarRequest, addEventRequest } from "../services/calendar.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";
import formatDate from "../utils/formatDate";

function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({ title: "", date: "", type: "Événement" });

  const fetchCalendar = async () => {
    try {
      const res = await getCalendarRequest();
      setEvents(res?.data || []);
    } catch (err) {
      showToast("Erreur de chargement.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCalendar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEventRequest(formData);
      showToast("Événement ajouté !");
      setShowForm(false);
      setFormData({ title: "", date: "", type: "Événement" });
      fetchCalendar();
    } catch (err) {
      showToast("Erreur lors de l'ajout.", "error");
    }
  };

  // Logique du Calendrier Mensuel
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const calendarDays = [];
  const startDay = firstDayOfMonth(year, month);
  const totalDays = daysInMonth(year, month);

  // Cases vides pour le début du mois
  for (let i = 0; i < (startDay === 0 ? 6 : startDay - 1); i++) {
    calendarDays.push(null);
  }
  // Jours du mois
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Calendrier Scolaire
          </h1>
          <p style={{ opacity: 0.6 }}>Planification des événements, examens et congés</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={prevMonth} className="btn" style={{ padding: "0.6rem", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <h2 style={{ minWidth: "150px", textAlign: "center", margin: 0, fontSize: "1.4rem" }}>{monthNames[month]} {year}</h2>
            <button onClick={nextMonth} className="btn" style={{ padding: "0.6rem", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
          
          {["super_admin", "director", "admin"].includes(user?.role) && (
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
              {showForm ? "Annuler" : "Ajouter un événement"}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="form" style={{ marginBottom: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Titre de l'événement</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Réunion parents-profs" required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Date</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Type d'entrée</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Événement">Événement</option>
                <option value="Congé">Congé</option>
                <option value="Examen">Examen</option>
                <option value="Réunion">Réunion</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: "0.8rem" }}>Enregistrer</button>
          </form>
        )}

        {loading ? <Loader /> : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(7, 1fr)", 
            gap: "5px", 
            background: "rgba(255,255,255,0.05)", 
            padding: "1rem", 
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(d => (
              <div key={d} style={{ textAlign: "center", padding: "10px", fontWeight: "bold", color: "var(--primary)", fontSize: "0.8rem" }}>{d}</div>
            ))}
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              return (
                <div key={index} style={{ 
                  minHeight: "100px", 
                  background: day ? "rgba(255,255,255,0.02)" : "transparent", 
                  borderRadius: "10px", 
                  padding: "10px",
                  border: day ? "1px solid rgba(255,255,255,0.05)" : "none",
                  position: "relative"
                }}>
                  <span style={{ opacity: 0.3, fontSize: "0.8rem" }}>{day}</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "5px" }}>
                    {dayEvents.map(e => (
                      <div key={e._id} title={e.title} style={{ 
                        fontSize: "0.65rem", 
                        padding: "4px 6px", 
                        borderRadius: "4px", 
                        background: e.type === "Congé" ? "#ff5252" : e.type === "Examen" ? "#F9AB00" : "var(--primary)",
                        color: "white",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: "3rem" }}>
          <h3>Liste des événements à venir</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
            {events.filter(e => new Date(e.date) >= new Date()).slice(0, 5).map(e => (
              <div key={e._id} style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: "4px", background: e.type === "Congé" ? "#ff5252" : e.type === "Examen" ? "#F9AB00" : "var(--primary)", display: "inline-block", marginBottom: "5px" }}>{e.type}</div>
                  <h3 style={{ fontSize: "1.2rem", margin: 0 }}>{e.title}</h3>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>{new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.4 }}>{new Date(e.date).getFullYear()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default CalendarPage;
