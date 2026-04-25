/**
 * @file CalendarPage.jsx
 * @description Page affichant le calendrier des événements scolaires et des échéances.
 */

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
      <main className="container" style={{ padding: "1.5rem" }}>
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 6vw, 2.5rem)", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.5rem" }}>
            Calendrier Scolaire
          </h1>
          <p style={{ opacity: 0.6, fontSize: "0.95rem" }}>Planification des événements et échéances</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", width: window.innerWidth < 480 ? "100%" : "auto", justifyContent: "center" }}>
            <button onClick={prevMonth} className="btn" style={{ padding: "8px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <h2 style={{ minWidth: "120px", textAlign: "center", margin: 0, fontSize: "1.1rem", fontWeight: "bold" }}>{monthNames[month]} {year}</h2>
            <button onClick={nextMonth} className="btn" style={{ padding: "8px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
          
          {["super_admin", "director", "admin"].includes(user?.role) && (
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ width: window.innerWidth < 480 ? "100%" : "auto", padding: "10px 20px", fontSize: "0.85rem" }}>
              {showForm ? "Annuler" : "Ajouter un événement"}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="form" style={{ marginBottom: "2.5rem", maxWidth: "800px", padding: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "0.75rem", opacity: 0.7 }}>Titre</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Nom de l'événement" style={{ padding: "10px", fontSize: "0.9rem" }} required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "0.75rem", opacity: 0.7 }}>Date</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "0.75rem", opacity: 0.7 }}>Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }}>
                  <option value="Événement">Événement</option>
                  <option value="Congé">Congé</option>
                  <option value="Examen">Examen</option>
                  <option value="Réunion">Réunion</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px", fontSize: "0.9rem" }}>Enregistrer l'événement</button>
          </form>
        )}

        {loading ? <Loader /> : (
          <div style={{ 
            background: "rgba(255,255,255,0.03)", 
            padding: "clamp(0.5rem, 3vw, 1rem)", 
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden"
          }}>
            {/* Jours de la semaine */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map(d => (
                <div key={d} style={{ textAlign: "center", padding: "10px 0", fontWeight: "900", color: "var(--primary)", fontSize: "0.7rem", textTransform: "uppercase" }}>{d}</div>
              ))}
            </div>
            
            {/* Grille des jours */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDay(day);
                return (
                  <div key={index} style={{ 
                    minHeight: window.innerWidth < 768 ? "60px" : "100px", 
                    background: day ? "rgba(255,255,255,0.01)" : "transparent", 
                    padding: "5px",
                    borderRight: "1px solid rgba(255,255,255,0.03)",
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    position: "relative"
                  }}>
                    <span style={{ opacity: day ? 0.4 : 0, fontSize: "0.75rem", fontWeight: "bold" }}>{day}</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
                      {dayEvents.map(e => (
                        <div key={e._id} title={e.title} style={{ 
                          width: "100%",
                          height: window.innerWidth < 768 ? "6px" : "auto",
                          fontSize: "0.55rem", 
                          padding: window.innerWidth < 768 ? "0" : "2px 4px", 
                          borderRadius: "2px", 
                          background: e.type === "Congé" ? "#ff5252" : e.type === "Examen" ? "#F9AB00" : "var(--primary)",
                          color: "white",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {window.innerWidth >= 768 && e.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginTop: "2.5rem" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Événements à venir</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {events.filter(e => new Date(e.date) >= new Date()).slice(0, 5).length > 0 ? (
              events.filter(e => new Date(e.date) >= new Date()).slice(0, 5).map(e => (
                <div key={e._id} style={{ 
                  background: "rgba(255,255,255,0.02)", 
                  padding: "1rem 1.2rem", 
                  borderRadius: "15px", 
                  border: "1px solid rgba(255,255,255,0.08)", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.6rem", padding: "2px 8px", borderRadius: "4px", background: e.type === "Congé" ? "#ff525220" : e.type === "Examen" ? "#F9AB0020" : "#1A73E820", color: e.type === "Congé" ? "#ff5252" : e.type === "Examen" ? "#F9AB00" : "#1A73E8", display: "inline-block", marginBottom: "4px", fontWeight: "bold", textTransform: "uppercase" }}>{e.type}</div>
                    <h3 style={{ fontSize: "1rem", margin: 0, fontWeight: "700" }}>{e.title}</h3>
                  </div>
                  <div style={{ textAlign: "right", minWidth: "80px" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: "900", color: "var(--primary)" }}>{new Date(e.date).getDate()}</div>
                    <div style={{ fontSize: "0.7rem", opacity: 0.5, textTransform: "capitalize" }}>{new Date(e.date).toLocaleDateString('fr-FR', { month: 'short' })}</div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", opacity: 0.4, padding: "2rem", fontSize: "0.9rem" }}>Aucun événement prévu prochainement.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default CalendarPage;
