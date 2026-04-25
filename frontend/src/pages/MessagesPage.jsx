/**
 * @file MessagesPage.jsx
 * @description Page de messagerie privée pour les échanges entre utilisateurs.
 */

import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [childrenInfo, setChildren] = useState([]);
  const [selectedChildId, setSelectedChild] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(new URLSearchParams(location.search).get("compose") === "true");
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    recipient: "",
    recipientModel: "Teacher",
    content: ""
  });

  const [selectedRole, setSelectedRole] = useState("teacher"); // "teacher" ou "director"

  const [fetchError, setFetchError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      
      // Sécurité : Timeout pour forcer l'arrêt du chargement après 6 secondes
      const timeout = setTimeout(() => {
        setLoading(false);
        console.warn("FetchData a mis trop de temps, arrêt forcé du loader.");
      }, 6000);

      const [resMsg, resTeachers] = await Promise.all([
        getMyMessagesRequest().catch(e => { console.error("Err Messages:", e); return { data: [] }; }),
        getTeachersRequest().catch(e => { console.error("Err Teachers:", e); return { data: [] }; })
      ]);
      
      setMessages(resMsg?.data || []);
      
      const role = user?.role;
      const isAdminOrDirector = ["admin", "director", "super_admin"].includes(role);
      const isTeacher = role === "teacher";
      const isParent = role === "parent";

      let parentsList = [];
      if (isParent) {
        try {
          const resDash = await getParentDashboardRequest();
          setChildren(resDash?.data?.children || []);
        } catch (e) {
          console.error("Err Dash Parent:", e);
        }
      } else if (isAdminOrDirector || isTeacher) {
        try {
          const resParents = await getParentsRequest();
          parentsList = resParents?.data || [];
        } catch (e) {
          console.error("Err Parents List:", e);
        }
      }

      const list = [
        ...(resTeachers?.data || []).map(t => ({ 
          id: t._id, 
          name: t.fullName, 
          role: t.role,
          model: "Teacher",
          school: t.school?._id || t.school
        })),
        ...parentsList.map(p => ({ 
          id: p._id, 
          name: p.fullName, 
          role: "parent",
          model: "Parent" 
        }))
      ].filter(r => r.id !== user?.id);
      
      setRecipients(list);
      clearTimeout(timeout);
    } catch (err) {
      console.error("Erreur critique messagerie:", err);
      setFetchError(err.message);
      showToast("Problème de connexion au service de messagerie.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Effet pour auto-sélectionner le destinataire pour les parents
  useEffect(() => {
    if (user.role === "parent" && selectedChildId && childrenInfo.length > 0) {
      const child = childrenInfo.find(c => c._id === selectedChildId);
      if (!child) return;

      if (selectedRole === "teacher") {
        // On cible le titulaire de la classe
        const teacher = child.classroom?.titularTeacher;
        // On récupère l'ID que ce soit un objet ou un string
        const teacherId = teacher?._id || teacher;
        
        if (teacherId && typeof teacherId === "string") {
          setFormData(prev => ({ ...prev, recipient: teacherId, recipientModel: "Teacher" }));
        } else {
          setFormData(prev => ({ ...prev, recipient: "", recipientModel: "Teacher" }));
        }
      } else {
        // On cible la direction (le premier admin/directeur trouvé dans l'école)
        const direction = recipients.find(r => 
          ["director", "admin"].includes(r.role) && 
          r.school === (child.school?._id || child.school)
        );
        if (direction) {
          setFormData(prev => ({ ...prev, recipient: direction.id, recipientModel: "Teacher" }));
        } else {
          setFormData(prev => ({ ...prev, recipient: "", recipientModel: "Teacher" }));
        }
      }
    }
  }, [selectedChildId, selectedRole, childrenInfo, recipients, user.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.recipient) {
      return showToast(user.role === "parent" ? "Destinataire non trouvé pour cette école." : "Veuillez choisir un destinataire.", "error");
    }
    
    try {
      // Pour les parents, recipientModel est déjà mis à jour par l'effet
      let model = formData.recipientModel;
      if (user.role !== "parent") {
        const selected = recipients.find(r => r.id === formData.recipient);
        model = selected?.model || "Teacher";
      }

      await sendMessageRequest({
        recipient: formData.recipient,
        recipientModel: model,
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

  const filteredRecipients = recipients.filter(r => {
    // Pour le staff, on montre tout le monde
    return true;
  });

  // Pour l'affichage du nom du destinataire auto-sélectionné (Parent uniquement)
  const getAutoRecipientName = () => {
    if (!formData.recipient) return "Aucun contact trouvé";
    
    // On cherche d'abord dans la liste des destinataires chargés
    const foundInList = recipients.find(r => r.id === formData.recipient);
    if (foundInList) return foundInList.name;

    // Si c'est le prof titulaire et qu'il est déjà dans l'objet child
    if (user.role === "parent" && selectedRole === "teacher") {
      const child = childrenInfo.find(c => c._id === selectedChildId);
      const teacher = child?.classroom?.titularTeacher;
      if (teacher && typeof teacher === "object" && teacher.fullName) {
        return teacher.fullName;
      }
    }

    return "Chargement...";
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "1.5rem" }}>
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 6vw, 2.5rem)", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.5rem" }}>
            Messagerie Interne
          </h1>
          <p style={{ opacity: 0.6, fontSize: "0.95rem" }}>Communiquez avec les enseignants et la direction</p>
        </div>

        <div style={{ marginBottom: "1.5rem", textAlign: "right" }}>
          <button 
            onClick={() => setShowCompose(!showCompose)} 
            className={`btn ${showCompose ? 'btn-danger' : 'btn-primary'}`}
            style={{ padding: "10px 20px", fontSize: "0.85rem" }}
          >
            {showCompose ? "Annuler" : "Nouveau Message"}
          </button>
        </div>

        {showCompose && (
          <form onSubmit={handleSubmit} className="form" style={{ 
            marginBottom: "2.5rem",
            maxWidth: "800px",
            padding: "1.5rem"
          }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>Nouveau message</h3>
            
            {user.role === "parent" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "rgba(255,255,255,0.03)", padding: "1.2rem", borderRadius: "12px", marginBottom: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "5px", display: "block" }}>1. Concerne quel enfant ?</label>
                  <select 
                    value={selectedChildId} 
                    onChange={e => { setSelectedChild(e.target.value); }}
                    style={{ padding: "10px", fontSize: "0.9rem" }}
                  >
                    <option value="">Sélectionner l'enfant</option>
                    {childrenInfo.map(c => <option key={c._id} value={c._id}>{c.fullName}</option>)}
                  </select>
                </div>

                {selectedChildId && (
                  <div>
                    <label style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>2. Qui voulez-vous contacter ?</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button 
                        type="button"
                        onClick={() => { setSelectedRole("teacher"); }}
                        className="btn"
                        style={{ flex: 1, padding: "8px", background: selectedRole === "teacher" ? "var(--primary)" : "rgba(255,255,255,0.1)", fontSize: "0.8rem" }}
                      >
                        Professeur
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setSelectedRole("director"); }}
                        className="btn"
                        style={{ flex: 1, padding: "8px", background: selectedRole === "director" ? "var(--primary)" : "rgba(255,255,255,0.1)", fontSize: "0.8rem" }}
                      >
                        Direction
                      </button>
                    </div>
                    
                    <div style={{ marginTop: "0.8rem", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <p style={{ margin: "0 0 12px 0", fontSize: "0.8rem", opacity: 0.7 }}>
                        Contact suggéré : <strong style={{ color: formData.recipient ? "var(--primary)" : "#ff5252" }}>{getAutoRecipientName()}</strong>
                      </p>
                      
                      <div style={{ borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: "12px" }}>
                        <label style={{ fontSize: "0.75rem", color: "var(--primary)", marginBottom: "8px", display: "block", fontWeight: "bold" }}>Ou choisir un autre contact de l'école :</label>
                        <select 
                          value={formData.recipient} 
                          onChange={e => setFormData({...formData, recipient: e.target.value, recipientModel: "Teacher"})}
                          style={{ width: "100%", padding: "10px", fontSize: "0.9rem", background: "white", color: "#222", borderRadius: "8px", border: "none" }}
                        >
                          <option value="">-- Sélectionner un contact --</option>
                          {recipients.filter(r => {
                            const child = childrenInfo.find(c => c._id === selectedChildId);
                            // On filtre pour ne garder que le staff (profs/directeurs) de l'école de l'enfant
                            return r.model === "Teacher" && r.school === (child?.school?._id || child?.school);
                          }).map(r => (
                            <option key={r.id} value={r.id}>
                              {r.name} ({r.role === 'teacher' ? 'Professeur' : 'Direction'})
                            </option>
                          ))}
                        </select>
                        <p style={{ fontSize: "0.65rem", opacity: 0.5, marginTop: "8px" }}>Seuls les membres du personnel de l'école de votre enfant sont affichés.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {user.role !== "parent" && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "5px", display: "block" }}>Destinataire</label>
                <select 
                  value={formData.recipient} 
                  onChange={e => setFormData({...formData, recipient: e.target.value})}
                  style={{ padding: "10px", fontSize: "0.9rem" }}
                >
                  <option value="">Sélectionner une personne</option>
                  {recipients.map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
                </select>
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "5px", display: "block" }}>Message</label>
              <textarea 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
                placeholder="Votre message..."
                style={{ minHeight: "100px", padding: "10px", fontSize: "0.9rem" }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px", fontSize: "0.9rem" }}>Envoyer</button>
          </form>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", fontWeight: "700" }}>Messages reçus</h2>
          {loading ? <Loader /> : (
            messages.length > 0 ? (
              messages.map(m => (
                <div 
                  key={m._id} 
                  onClick={() => !m.read && handleMarkAsRead(m._id)}
                  style={{ 
                    background: m.read ? "rgba(255,255,255,0.02)" : "rgba(26, 115, 232, 0.1)", 
                    padding: "1rem 1.2rem", 
                    borderRadius: "15px", 
                    border: m.read ? "1px solid rgba(255,255,255,0.05)" : "1px solid var(--primary)",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: m.read ? "inherit" : "var(--primary)" }}>{m.sender?.fullName || "Utilisateur"}</span>
                    <span style={{ fontSize: "0.65rem", opacity: 0.4 }}>{m.createdAt ? formatDate(m.createdAt) : ""}</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", opacity: 0.8, margin: 0, lineHeight: "1.4" }}>{m.content}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", opacity: 0.3, padding: "2rem", fontSize: "0.9rem" }}>Aucun message.</p>
            )
          )}
        </div>
      </main>
    </>
  );
}

export default MessagesPage;