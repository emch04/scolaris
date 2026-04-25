/**
 * @file ClassroomChatPage.jsx
 * @description Page de messagerie en temps réel dédiée aux discussions au sein d'une classe.
 */

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getClassroomMessagesRequest, sendMessageRequest } from "../services/message.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";

function ClassroomChatPage() {
  const { classroomId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const { showToast } = useToast();
  const chatEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await getClassroomMessagesRequest(classroomId);
      setMessages(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Rafraîchissement auto
    return () => clearInterval(interval);
  }, [classroomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await sendMessageRequest({
        classroomId,
        content: content.trim()
      });
      setContent("");
      fetchMessages();
    } catch (err) {
      showToast("Erreur lors de l'envoi.", "error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ display: "flex", flexDirection: "column", height: "85vh", paddingTop: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "1.8rem" }}>Espace Discussion Classe</h1>
          <p style={{ opacity: 0.5, fontSize: "0.9rem" }}>Travaillez et échangez avec vos camarades et vos professeurs</p>
        </div>

        <div style={{ 
          flex: 1, 
          background: "rgba(255,255,255,0.03)", 
          borderRadius: "20px", 
          border: "3px solid rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Liste des messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {loading ? <Loader /> : (
              messages.length > 0 ? messages.map(m => {
                const isMe = m.sender?._id === user.id;
                const isStaff = ["teacher", "admin", "director"].includes(m.sender?.role);
                
                return (
                  <div key={m._id} style={{ 
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    maxWidth: "70%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start"
                  }}>
                    <div style={{ fontSize: "0.7rem", opacity: 0.5, marginBottom: "4px", display: "flex", gap: "5px" }}>
                      <span style={{ fontWeight: "bold", color: isStaff ? "var(--primary)" : "inherit" }}>
                        {m.sender?.fullName}
                      </span>
                      • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ 
                      padding: "10px 15px", 
                      borderRadius: "15px", 
                      borderTopRightRadius: isMe ? "2px" : "15px",
                      borderTopLeftRadius: !isMe ? "2px" : "15px",
                      background: isMe ? "var(--primary)" : (isStaff ? "rgba(26, 115, 232, 0.2)" : "rgba(255,255,255,0.1)"),
                      color: isMe ? "white" : "inherit",
                      fontSize: "0.95rem"
                    }}>
                      {m.content}
                    </div>
                  </div>
                )
              }) : (
                <p style={{ textAlign: "center", opacity: 0.3, marginTop: "2rem" }}>Aucun message. Commencez la discussion !</p>
              )
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Zone de saisie */}
          <form onSubmit={handleSend} style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)", display: "flex", gap: "10px" }}>
            <input 
              type="text" 
              value={content} 
              onChange={e => setContent(e.target.value)}
              placeholder="Écrivez un message pour la classe..."
              style={{ flex: 1, padding: "12px 20px", borderRadius: "30px", background: "white", color: "#222", border: "none" }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: "50%", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default ClassroomChatPage;
