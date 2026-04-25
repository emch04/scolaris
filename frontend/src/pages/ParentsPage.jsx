/**
 * @file ParentsPage.jsx
 * @description Page de gestion de la liste des parents d'élèves.
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getParentsRequest, updateParentRequest } from "../services/parent.api";
import { getStudentsRequest } from "../services/student.api";

function ParentsPage() {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState({});

  const fetchData = async () => {
    try {
      const [resParents, resStudents] = await Promise.all([
        getParentsRequest(),
        getStudentsRequest()
      ]);
      setParents(resParents?.data || []);
      setStudents(resStudents?.data || []);
    } catch (err) {
      console.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddChild = async (parentId) => {
    const studentId = selectedStudent[parentId];
    if (!studentId) return alert("Veuillez sélectionner un élève.");

    const parent = parents.find(p => p._id === parentId);
    if (parent.children.some(c => c._id === studentId)) {
      return alert("Cet enfant est déjà rattaché à ce parent.");
    }

    try {
      const updatedChildren = [...parent.children.map(c => c._id), studentId];
      await updateParentRequest(parentId, { children: updatedChildren });
      alert("Enfant rattaché avec succès !");
      fetchData();
    } catch (err) {
      alert("Erreur lors du rattachement.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Gestion des Parents
          </h1>
          <p style={{ opacity: 0.6 }}>Gérez les comptes parents et rachetez les élèves à leurs familles</p>
        </div>

        {/* Mini Tableau de Bord */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
          <div style={{ 
            background: "rgba(249, 171, 0, 0.1)", 
            border: "1px solid #F9AB00", 
            padding: "1rem 2rem", 
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#F9AB00" }}>{parents.length}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", opacity: 0.7 }}>Parents</div>
              <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>Inscrits sur la plateforme</div>
            </div>
          </div>
        </div>

        {loading ? <Loader /> : (
          <div className="grid">
            {parents.map(p => (
              <div key={p._id} style={{ 
                background: "transparent", 
                padding: "1.5rem", 
                borderRadius: "15px", 
                border: "3px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <h3 style={{ marginBottom: "0.5rem", fontSize: "1.2rem" }}>{p.fullName}</h3>
                  <p style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "1.5rem" }}>{p.email} • {p.phone}</p>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{ fontSize: "0.9rem", marginBottom: "0.8rem", color: "var(--primary)" }}>Enfants rattachés :</h4>
                    {p.children.length === 0 ? (
                      <p style={{ fontSize: "0.8rem", opacity: 0.4 }}>Aucun enfant lié.</p>
                    ) : (
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {p.children.map(c => (
                          <li key={c._id} style={{ fontSize: "0.9rem", padding: "5px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span style={{ flex: 1 }}>{c.fullName}</span>
                            <span style={{ opacity: 0.4, fontSize: "0.75rem" }}>({c.matricule})</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem" }}>
                  <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>Rattacher un nouvel enfant :</label>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <select 
                      value={selectedStudent[p._id] || ""} 
                      onChange={e => setSelectedStudent({...selectedStudent, [p._id]: e.target.value})}
                      style={{ flex: 1, minWidth: "150px", background: "white", color: "#222", padding: "0.8rem", borderRadius: "8px", border: "2px solid #ccc", fontSize: "0.85rem" }}
                    >
                      <option value="" style={{ background: "white", color: "#222" }}>Sélectionner un élève</option>
                      {students.map(s => (
                        <option key={s._id} value={s._id} style={{ background: "white", color: "#222" }}>
                          {s.fullName} ({s.matricule})
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={() => handleAddChild(p._id)}
                      className="btn btn-primary" 
                      style={{ padding: "0.8rem 1.5rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default ParentsPage;
