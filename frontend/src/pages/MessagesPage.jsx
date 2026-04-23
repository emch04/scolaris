import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getMyMessagesRequest, sendMessageRequest, markMessageAsReadRequest } from "../services/message.api";
import { getParentsRequest } from "../services/parent.api";
import { getTeachersRequest } from "../services/teacher.api";
import { getParentDashboardRequest } from "../services/parent.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";
import formatDate from "../utils/formatDate";

function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [childrenInfo, setChildren] = useState([]);
  const [selectedChildId, setSelectedChild] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    recipient: "",
    recipientModel: "Teacher",
    content: ""
  });

  const fetchData = async () => {
    try {
      const [resMsg, resParents, resTeachers] = await Promise.all([
        getMyMessagesRequest(),
        getParentsRequest(),
        getTeachersRequest()
      ]);
      setMessages(resMsg?.data || []);
      
      const role = user.role;
      const isAdminOrDirector = ["admin", "director"].includes(role);
      const isTeacher = role === "teacher";
      const isParent = role === "parent";

      if (isParent) {
        const resDash = await getParentDashboardRequest();
        setChildren(resDash.children || []);
      }

      const list = [
        ...(resTeachers?.data || []).map(t => ({ 
          id: t._id, 
          name: `${t.fullName} (${t.role === 'teacher' ? 'Professeur' : 'Direction'})`, 
          model: "Teacher",
          school: t.school?._id || t.school
        })),
        ...((isTeacher || isAdminOrDirector) ? (resParents?.data || []).map(p => ({ 
          id: p._id, 
          name: `${p.fullName} (Parent)`, 
          model: "Parent" 
        })) : [])
      ].filter(r => r.id !== user.id);
      
      setRecipients(list);
    } catch (err) {
      showToast("Erreur de chargement.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.recipient) return showToast("Veuillez choisir un destinataire.", "error");
    
    try {
      const selected = recipients.find(r => r.id === formData.recipient);
      await sendMessageRequest({
        recipient: formData.recipient,
        recipientModel: selected.model,
        content: formData.content
      });
      showToast("Message envoyé !");
      setShowCompose(false);
      setFormData({ recipient: "", recipientModel: "Teacher", content: "" });
      fetchData();
    } catch (err) {
      showToast("Erreur lors de l'envoi.", "error");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markMessageAsReadRequest(id);
      setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRecipients = user.role === "parent" && selectedChildId 
    ? recipients.filter(r => {
        const child = childrenInfo.find(c => c._id === selectedChildId);
        // On garde le staff de l'école de l'enfant
        return r.model === "Teacher" && r.school === (child.school?._id || child.school);
      })
    : recipients;

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Messagerie Interne
          </h1>
          <p style={{ opacity: 0.6 }}>Communiquez avec les enseignants et la direction</p>
        </div>

        <div style={{ marginBottom: "2rem", textAlign: "right" }}>
          <button onClick={() => setShowCompose(!showCompose)} className="btn btn-primary">
            {showCompose ? "Annuler" : "Nouveau Message"}
          </button>
        </div>

        {showCompose && (
          <form onSubmit={handleSubmit} style={{ 
            background: "rgba(255,255,255,0.03)", 
            padding: "2rem", 
            borderRadius: "20px", 
            border: "1px solid rgba(255,255,255,0.1)",
            marginBottom: "3rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}>
            {user.role === "parent" && (
              <div>
                <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>Concerne quel enfant ?</label>
                <select 
                  value={selectedChildId} 
                  onChange={e => setSelectedChild(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "white", color: "#222" }}
                >
                  <option value="">Sélectionner votre enfant</option>
                  {childrenInfo.map(c => <option key={c._id} value={c._id}>{c.fullName} ({c.classroom?.name})</option>)}
                </select>
              </div>
            )}
            <div>
              <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>Destinataire</label>
              <select 
                value={formData.recipient} 
                onChange={e => setFormData({...formData, recipient: e.target.value})}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "white", color: "#222" }}
                disabled={user.role === "parent" && !selectedChildId}
              >
                <option value="">{user.role === "parent" ? "Choisissez d'abord l'enfant" : "Sélectionner une personne"}</option>
                {filteredRecipients.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>Message</label>
              <textarea 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
                placeholder="Votre message..."
                style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "white", color: "#222", minHeight: "120px" }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "0.8rem 2.5rem" }}>Envoyer</button>
          </form>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Messages reçus</h2>
          {loading ? <Loader /> : (
            messages.length > 0 ? (
              messages.map(m => (
                <div 
                  key={m._id} 
                  onClick={() => !m.read && handleMarkAsRead(m._id)}
                  style={{ 
                    background: m.read ? "rgba(255,255,255,0.02)" : "rgba(26, 115, 232, 0.1)", 
                    padding: "1.5rem", 
                    borderRadius: "15px", 
                    border: m.read ? "1px solid rgba(255,255,255,0.05)" : "1px solid var(--primary)",
                    cursor: "pointer",
                    transition: "0.2s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: "bold", color: m.read ? "inherit" : "var(--primary)" }}>{m.sender?.fullName || "Utilisateur Scolaris"}</span>
                    <span style={{ fontSize: "0.75rem", opacity: 0.5 }}>{formatDate(m.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: "0.95rem", opacity: 0.8 }}>{m.content}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", opacity: 0.3, padding: "3rem" }}>Votre boîte de réception est vide.</p>
            )
          )}
        </div>
      </main>
    </>
  );
}

export default MessagesPage;
