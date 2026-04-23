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

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Calendrier Scolaire
          </h1>
          <p style={{ opacity: 0.6 }}>Planification des événements, examens et congés</p>
        </div>

        {["super_admin", "director", "admin"].includes(user?.role) && (
          <div style={{ marginBottom: "2rem", textAlign: "right" }}>
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
              {showForm ? "Annuler" : "Ajouter au calendrier"}
            </button>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.03)", padding: "2rem", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", alignItems: "flex-end" }}>
            <div>
              <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Titre</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none" }} required />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Date</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none" }} required />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none" }}>
                <option value="Événement">Événement</option>
                <option value="Congé">Congé</option>
                <option value="Examen">Examen</option>
                <option value="Réunion">Réunion</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Enregistrer</button>
          </form>
        )}

        {loading ? <Loader /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {events.length > 0 ? events.map(e => (
              <div key={e._id} style={{ 
                background: "rgba(255,255,255,0.03)", 
                padding: "1.5rem", 
                borderRadius: "15px", 
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: "4px", background: e.type === "Congé" ? "#ff5252" : e.type === "Examen" ? "#F9AB00" : "var(--primary)", display: "inline-block", marginBottom: "5px" }}>{e.type}</div>
                  <h3 style={{ fontSize: "1.2rem" }}>{e.title}</h3>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>{new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.4 }}>{new Date(e.date).getFullYear()}</div>
                </div>
              </div>
            )) : <p style={{ textAlign: "center", opacity: 0.3, padding: "4rem" }}>Aucun événement prévu.</p>}
          </div>
        )}
      </main>
    </>
  );
}

export default CalendarPage;
