/**
 * @file ParentsPage.jsx
 * @description Page de gestion de la liste des parents d'élèves.
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getParentsRequest, updateParentRequest } from "../services/parent.api";
import { getStudentsRequest } from "../services/student.api";
import { useToast } from "../context/ToastContext";

function ParentsPage() {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [pagination, setPagination] = useState({ total: 0 });
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [resParents, resStudents] = await Promise.all([
        getParentsRequest(1, 100),
        getStudentsRequest(1, 100)
      ]);
      const parentsData = resParents?.data?.parents || resParents?.data || [];
      setParents(parentsData);
      setPagination({ total: resParents?.data?.pagination?.total || parentsData.length });
      setStudents(resStudents?.data?.students || resStudents?.data || []);
    } catch (err) {
      showToast("Erreur de chargement.", "error");
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
    if (!studentId) return showToast("Veuillez sélectionner un élève.", "info");

    const parent = parents.find(p => p._id === parentId);
    if (parent.children.some(c => c._id === studentId)) {
      return showToast("Cet enfant est déjà rattaché à ce parent.", "info");
    }

    try {
      const updatedChildren = [...parent.children.map(c => c._id), studentId];
      await updateParentRequest(parentId, { children: updatedChildren });
      showToast("Enfant rattaché avec succès !");
      fetchData();
    } catch (err) {
      showToast("Erreur lors du rattachement.", "error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "1.5rem" }}>
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 6vw, 2.5rem)", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap", lineHeight: "1.1" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Gestion des Parents
          </h1>
          <p style={{ opacity: 0.6, fontSize: "0.95rem", marginTop: "0.5rem" }}>Comptes parents et liens familiaux</p>
        </div>

        {/* Mini Tableau de Bord */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <div style={{ 
            background: "rgba(249, 171, 0, 0.1)", 
            border: "1px solid rgba(249, 171, 0, 0.3)", 
            padding: "0.8rem 1.5rem", 
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#F9AB00" }}>{pagination.total}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", opacity: 0.8, color: "#F9AB00" }}>Parents</div>
              <div style={{ fontSize: "0.65rem", opacity: 0.5 }}>Inscrits au réseau</div>
            </div>
          </div>
        </div>

        {loading ? <Loader /> : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {parents.map(p => (
              <div key={p._id} style={{ 
                background: "rgba(255,255,255,0.02)", 
                padding: "1.2rem", 
                borderRadius: "20px", 
                border: "1px solid rgba(255, 255, 255, 0.12)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <h3 style={{ marginBottom: "0.3rem", fontSize: "1.1rem" }}>{p.fullName}</h3>
                  <p style={{ fontSize: "0.8rem", opacity: 0.6, marginBottom: "1.2rem" }}>{p.email} <br /> {p.phone}</p>

                  <div style={{ marginBottom: "1.2rem" }}>
                    <h4 style={{ fontSize: "0.85rem", marginBottom: "0.8rem", color: "var(--primary)", fontWeight: "bold" }}>Enfants rattachés :</h4>
                    {p.children?.length === 0 ? (
                      <p style={{ fontSize: "0.75rem", opacity: 0.4 }}>Aucun lien.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {p.children?.map(c => (
                          <div key={c._id} style={{ fontSize: "0.85rem", padding: "6px 10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span style={{ flex: 1, fontWeight: "500" }}>{c.fullName}</span>
                            <span style={{ opacity: 0.4, fontSize: "0.7rem" }}>{c.matricule}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.2rem" }}>
                  <label style={{ fontSize: "0.75rem", opacity: 0.5, marginBottom: "8px", display: "block", textTransform: "uppercase", fontWeight: "bold" }}>Rattacher un élève</label>
                  <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                    <select 
                      value={selectedStudent[p._id] || ""} 
                      onChange={e => setSelectedStudent({...selectedStudent, [p._id]: e.target.value})}
                      style={{ background: "white", color: "#222", padding: "10px", borderRadius: "10px", border: "none", fontSize: "0.85rem" }}
                    >
                      <option value="">Choisir un élève</option>
                      {students.map(s => (
                        <option key={s._id} value={s._id}>{s.fullName} ({s.matricule})</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => handleAddChild(p._id)}
                      className="btn btn-primary" 
                      style={{ padding: "10px", fontSize: "0.85rem", fontWeight: "bold" }}
                    >
                      LIER L'ENFANT
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
