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
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Messagerie Interne
          </h1>
          <p style={{ opacity: 0.6 }}>Communiquez avec les enseignants et la direction</p>
        </div>

        <div style={{ marginBottom: "2rem", textAlign: "right" }}>
          <button 
            onClick={() => setShowCompose(!showCompose)} 
            className={`btn ${showCompose ? 'btn-danger' : 'btn-primary'}`}
            style={{ padding: "0.8rem 2rem" }}
          >
            {showCompose ? "Annuler" : "Nouveau Message"}
          </button>
        </div>

        {showCompose && (
          <form onSubmit={handleSubmit} className="form" style={{ 
            marginBottom: "3rem",
            maxWidth: "100%"
          }}>
            <h3 style={{ marginBottom: "1rem" }}>Nouveau message</h3>
            
            {user.role === "parent" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "15px", marginBottom: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>1. Concerne quel enfant ?</label>
                  <select 
                    value={selectedChildId} 
                    onChange={e => { setSelectedChild(e.target.value); }}
                  >
                    <option value="">Sélectionner votre enfant</option>
                    {childrenInfo.map(c => <option key={c._id} value={c._id}>{c.fullName} ({c.classroom?.name || "Classe non définie"})</option>)}
                  </select>
                </div>

                {selectedChildId && (
                  <div>
                    <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "10px", display: "block" }}>2. Qui voulez-vous contacter ?</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button 
                        type="button"
                        onClick={() => { setSelectedRole("teacher"); }}
                        className="btn"
                        style={{ flex: 1, background: selectedRole === "teacher" ? "var(--primary)" : "rgba(255,255,255,0.1)", fontSize: "0.85rem" }}
                      >
                        Le Professeur
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setSelectedRole("director"); }}
                        className="btn"
                        style={{ flex: 1, background: selectedRole === "director" ? "var(--primary)" : "rgba(255,255,255,0.1)", fontSize: "0.85rem" }}
                      >
                        La Direction
                      </button>
                    </div>
                    
                    <div style={{ marginTop: "1rem", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.7 }}>
                        Destinataire automatique : <strong style={{ color: formData.recipient ? "var(--primary)" : "#ff5252" }}>{getAutoRecipientName()}</strong>
                      </p>
                    </div>

                    {!formData.recipient && (
                      <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(255,82,82,0.05)", borderRadius: "10px", border: "1px solid rgba(255,82,82,0.2)" }}>
                        <label style={{ fontSize: "0.8rem", color: "#ff5252", marginBottom: "8px", display: "block" }}>Aucun destinataire automatique trouvé. Veuillez choisir manuellement :</label>
                        <select 
                          value={formData.recipient} 
                          onChange={e => setFormData({...formData, recipient: e.target.value, recipientModel: "Teacher"})}
                        >
                          <option value="">Sélectionner un membre du personnel</option>
                          {recipients.filter(r => {
                            const child = childrenInfo.find(c => c._id === selectedChildId);
                            return r.school === (child?.school?._id || child?.school);
                          }).map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {user.role !== "parent" && (
              <div>
                <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>Destinataire</label>
                <select 
                  value={formData.recipient} 
                  onChange={e => setFormData({...formData, recipient: e.target.value})}
                >
                  <option value="">Sélectionner une personne</option>
                  {recipients.map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
                </select>
              </div>
            )}

            <div>
              <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "8px", display: "block" }}>Message</label>
              <textarea 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
                placeholder="Écrivez votre message ici..."
                style={{ minHeight: "150px" }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "0.8rem 2.5rem" }}>Envoyer le message</button>
          </form>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Messages reçus</h2>
          {fetchError && (
            <div style={{ padding: "1rem", background: "rgba(255,82,82,0.1)", border: "1px solid #ff5252", borderRadius: "10px", color: "#ff5252", fontSize: "0.9rem", marginBottom: "1rem" }}>
              Erreur: {fetchError}. <button onClick={fetchData} style={{ background: "none", border: "none", color: "white", textDecoration: "underline", cursor: "pointer" }}>Réessayer</button>
            </div>
          )}
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
                    <span style={{ fontSize: "0.75rem", opacity: 0.5 }}>{m.createdAt ? formatDate(m.createdAt) : ""}</span>
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