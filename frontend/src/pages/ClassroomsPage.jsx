import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { getClassroomsRequest } from "../services/classroom.api";
import { getSchoolsRequest } from "../services/school.api";
import apiClient from "../services/apiClient";

function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState([]);
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({ name: "", level: "", school: "" });

  const fetchData = () => {
    getClassroomsRequest().then(res => setClassrooms(res?.data || []));
    getSchoolsRequest().then(res => setSchools(res?.data || []));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await apiClient.post("/classrooms", formData);
    setFormData({ name: "", level: "", school: "" });
    fetchData();
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Gestion des Classes
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Organisez les niveaux et les sections par établissement</p>
        </div>

        {/* Formulaire épuré */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.03)", 
          padding: "2rem", 
          borderRadius: "20px", 
          border: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: "3rem"
        }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Ouvrir une nouvelle classe</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <input 
                placeholder="Nom (ex: 6ème A)" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                required 
              />
              <input 
                placeholder="Niveau (ex: Primaire 6)" 
                value={formData.level} 
                onChange={e => setFormData({...formData, level: e.target.value})} 
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                required 
              />
              <select 
                value={formData.school} 
                onChange={e => setFormData({...formData, school: e.target.value})} 
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px", color: "white" }}
                required
              >
                <option value="" style={{ background: "#222" }}>Choisir l'établissement</option>
                {schools.map(s => <option key={s._id} value={s._id} style={{ background: "#222" }}>{s.name}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "0.8rem 2rem" }}>
              Enregistrer la classe
            </button>
          </form>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem" }}>Classes actives</h2>
          <span style={{ opacity: 0.5, fontSize: "0.9rem" }}>{classrooms.length} sections</span>
        </div>

        <div className="grid">
          {classrooms.length === 0 ? (
            <p style={{ textAlign: "center", gridColumn: "1/-1", padding: "3rem", opacity: 0.5 }}>Aucune classe enregistrée.</p>
          ) : (
            classrooms.map(c => (
              <div key={c._id} style={{ 
                background: "rgba(255, 255, 255, 0.05)", 
                padding: "1.5rem", 
                borderRadius: "15px", 
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "bold", marginBottom: "0.5rem" }}>{c.level}</div>
                <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>{c.name}</h3>
                <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                  <p>🏫 {c.school?.name || "École non spécifiée"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
export default ClassroomsPage;
