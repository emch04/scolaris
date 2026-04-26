/**
 * @file TreasuryPage.jsx
 * @description Page de gestion financière robuste avec rafraîchissement forcé.
 */

import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getTreasuryStatsRequest, getPaymentsRequest, recordPaymentRequest, getFeesRequest } from "../services/finance.api";
import { getStudentsRequest } from "../services/student.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";
import formatDate from "../utils/formatDate";
import jsPDF from "jspdf";

function TreasuryPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ in: 0, out: 0, balance: 0 });
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); 
  const { showToast } = useToast();

  const [paymentData, setPaymentData] = useState({ student: "", fee: "", amountPaid: "", method: "cash", reference: "" });

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    
    try {
      const [resStats, resPayments, resStudents, resFees] = await Promise.all([
        getTreasuryStatsRequest(),
        getPaymentsRequest(),
        getStudentsRequest(1, 100),
        getFeesRequest()
      ]);
      
      if (resStats?.data) setStats(resStats.data);
      if (resPayments?.data) setPayments(resPayments.data);
      setStudents(resStudents?.data?.students || []);
      setFees(resFees?.data || []);
    } catch (err) {
      showToast("Erreur de synchronisation financière.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
    // Rafraîchissement automatique toutes les 20 secondes
    const interval = setInterval(() => fetchData(true), 20000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setRefreshing(true);
    try {
      await recordPaymentRequest({ ...paymentData, school: user.school }); 
      showToast("Paiement validé avec succès !");
      setPaymentData({ student: "", fee: "", amountPaid: "", method: "cash", reference: "" });
      
      // Forcer la mise à jour immédiate
      await fetchData(true);
      setActiveTab("overview");
    } catch (err) {
      showToast("Échec de l'enregistrement.", "error");
    } finally {
      setRefreshing(false);
    }
  };

  const generateReceipt = (p) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
    doc.setFillColor(26, 115, 232);
    doc.rect(0, 0, 150, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16); doc.setFont("helvetica", "bold");
    doc.text("RECU DE PAIEMENT", 10, 12);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text(`Date : ${formatDate(p.createdAt)}`, 10, 30);
    doc.text(`Réf : ${p._id.substring(0, 8).toUpperCase()}`, 100, 30);
    doc.line(10, 35, 140, 35);
    doc.text("ÉLÈVE :", 10, 45); doc.text(`${p.student?.fullName || "N/A"}`, 40, 45);
    doc.text("MOTIF :", 10, 55); doc.text(`${p.fee?.title || "Frais"}`, 40, 55);
    doc.text("MONTANT :", 10, 70); doc.setFontSize(14); doc.text(`${p.amountPaid} $`, 40, 70);
    doc.setFontSize(10); doc.text("CAISSIER :", 10, 110); doc.text(`${p.receivedBy?.fullName || "Agent"}`, 45, 110);
    doc.save(`Recu_${p._id.substring(0,4)}.pdf`);
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "2rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginBottom: "10px" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "900", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>Trésorerie</h1>
            {refreshing && <div className="spinner-small" style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.1)", borderTop: "2px solid var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>}
          </div>
          <p style={{ opacity: 0.6 }}>{user.role === 'secretary' ? 'Mon journal de caisse opérationnel' : 'Vue financière globale'}</p>
        </div>

        {loading ? <Loader /> : (
          <>
            {/* Statistiques Dynamiques */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
              <div style={{ background: "rgba(52, 168, 83, 0.1)", padding: "2rem", borderRadius: "25px", border: "1px solid rgba(52, 168, 83, 0.3)", position: "relative", overflow: "hidden" }}>
                <p style={{ fontSize: "0.75rem", opacity: 0.7, fontWeight: "bold", textTransform: "uppercase" }}>Entrées</p>
                <h2 style={{ fontSize: "2.5rem", margin: "10px 0", color: "#34A853", fontWeight: "900" }}>{stats.in.toLocaleString()} $</h2>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "#34A853", opacity: 0.3 }}></div>
              </div>
              <div style={{ background: "rgba(234, 67, 53, 0.1)", padding: "2rem", borderRadius: "25px", border: "1px solid rgba(234, 67, 53, 0.3)", position: "relative", overflow: "hidden" }}>
                <p style={{ fontSize: "0.75rem", opacity: 0.7, fontWeight: "bold", textTransform: "uppercase" }}>Sorties</p>
                <h2 style={{ fontSize: "2.5rem", margin: "10px 0", color: "#EA4335", fontWeight: "900" }}>{stats.out.toLocaleString()} $</h2>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "#EA4335", opacity: 0.3 }}></div>
              </div>
              <div style={{ background: "rgba(26, 115, 232, 0.1)", padding: "2rem", borderRadius: "25px", border: "1px solid rgba(26, 115, 232, 0.3)", position: "relative", overflow: "hidden" }}>
                <p style={{ fontSize: "0.75rem", opacity: 0.7, fontWeight: "bold", textTransform: "uppercase" }}>Solde en Caisse</p>
                <h2 style={{ fontSize: "2.5rem", margin: "10px 0", color: "#1A73E8", fontWeight: "900" }}>{stats.balance.toLocaleString()} $</h2>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "#1A73E8", opacity: 0.3 }}></div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "2rem", overflowX: "auto", paddingBottom: "10px" }}>
              <button onClick={() => setActiveTab("overview")} className="btn" style={{ padding: "10px 25px", borderRadius: "12px", background: activeTab === "overview" ? "white" : "rgba(255,255,255,0.05)", color: activeTab === "overview" ? "black" : "white", fontWeight: "bold" }}>Historique</button>
              <button onClick={() => setActiveTab("receipt")} className="btn" style={{ padding: "10px 25px", borderRadius: "12px", background: activeTab === "receipt" ? "#34A853" : "rgba(255,255,255,0.05)", color: "white", fontWeight: "bold" }}>Nouvel Encaissement</button>
            </div>

            {activeTab === "overview" && (
              <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "25px", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                        <th style={{ padding: "1.2rem" }}>Date</th>
                        <th style={{ padding: "1.2rem" }}>Élève / Matricule</th>
                        <th style={{ padding: "1.2rem" }}>Désignation</th>
                        <th style={{ padding: "1.2rem" }}>Montant</th>
                        <th style={{ padding: "1.2rem", textAlign: "center" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length === 0 ? (
                        <tr><td colSpan="5" style={{ padding: "4rem", textAlign: "center", opacity: 0.3 }}>Aucune transaction récente.</td></tr>
                      ) : (
                        payments.map(p => (
                          <tr key={p._id} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                            <td style={{ padding: "1.2rem", fontSize: "0.85rem", opacity: 0.7 }}>{formatDate(p.createdAt)}</td>
                            <td style={{ padding: "1.2rem" }}>
                                <div style={{ fontWeight: "bold" }}>{p.student?.fullName}</div>
                                <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>{p.student?.matricule}</div>
                            </td>
                            <td style={{ padding: "1.2rem", fontSize: "0.85rem" }}>{p.fee?.title || "Frais divers"}</td>
                            <td style={{ padding: "1.2rem", fontWeight: "900", color: "#34A853" }}>{p.amountPaid.toLocaleString()} $</td>
                            <td style={{ padding: "1.2rem", textAlign: "center" }}>
                                <button onClick={() => generateReceipt(p)} className="btn btn-primary" style={{ padding: "8px 15px", fontSize: "0.75rem", borderRadius: "10px" }}>REÇU PDF</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "receipt" && (
              <div className="form" style={{ maxWidth: "550px", margin: "0 auto", padding: "2rem", borderRadius: "30px" }}>
                <h3 style={{ marginBottom: "2rem", textAlign: "center" }}>Encaisser un paiement</h3>
                <form onSubmit={handlePaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>Sélectionner l'élève</label>
                    <select value={paymentData.student} onChange={e => setPaymentData({...paymentData, student: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "white", color: "#222" }}>
                      <option value="">-- Choisir un élève --</option>
                      {students.map(s => <option key={s._id} value={s._id}>{s.fullName} ({s.matricule})</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>Type de frais</label>
                    <select value={paymentData.fee} onChange={e => setPaymentData({...paymentData, fee: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "white", color: "#222" }}>
                      <option value="">-- Choisir le motif --</option>
                      {fees.map(f => <option key={f._id} value={f._id}>{f.title} ({f.amount} $)</option>)}
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>Montant versé ($)</label>
                      <input type="number" value={paymentData.amountPaid} onChange={e => setPaymentData({...paymentData, amountPaid: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "white", color: "#222" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>Mode de paiement</label>
                      <select value={paymentData.method} onChange={e => setPaymentData({...paymentData, method: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "white", color: "#222" }}>
                        <option value="cash">Espèces</option>
                        <option value="banque">Banque</option>
                        <option value="mobile_money">Mobile Money</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success" style={{ padding: "15px", marginTop: "1rem", fontWeight: "bold", fontSize: "1rem", borderRadius: "15px" }}>VALIDER L'ENCAISSEMENT</button>
                </form>
              </div>
            )}
          </>
        )}
      </main>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

export default TreasuryPage;
