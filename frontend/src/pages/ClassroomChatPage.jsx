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
  const [showEmojis, setShowEmojis] = useState(false);
  const { showToast } = useToast();
  const chatEndRef = useRef(null);

  const emojis = Array.from(new Set([
    "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠",
    "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "👂", "👃", "🧠", "🦷", "🦴", "👀", "👁️", "👅", "👄",
    "📚", "📖", "📜", "📝", "🖊️", "🖋️", "✒️", "🎨", "🎭", "🎓", "🎒", "🔭", "🔬", "🏫", "🏢", "📐", "📏", "📋", "📅", "🗓️", "⌛", "⏳", "⌚", "⏰", "💡",
    "✅", "❌", "❓", "❗", "💯", "🌟", "✨", "🔥", "🚀", "🎉", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "⭐", "🌈", "☀️", "🌙", "☁️", "🌍", "🌎", "🌏", "📍", "🚩", "🏁", "🎵", "🎶", "💻", "📱", "📞", "☎️"
  ]));

  const addEmoji = (emoji) => {
    setContent(prev => prev + emoji);
    // On ne ferme pas forcément pour permettre d'en mettre plusieurs
  };

  const fetchMessages = async () => {
    if (!user) return; // Ne pas charger si pas d'utilisateur
    try {
      const res = await getClassroomMessagesRequest(classroomId);
      setMessages(res?.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("Session expirée dans le chat.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchMessages();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchMessages();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [classroomId, user]);

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
      <main className="container-fluid" style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "calc(100vh - 60px)", 
        padding: window.innerWidth < 768 ? "0" : "1.5rem",
        marginTop: "60px",
        overflow: "hidden"
      }}>
        <div style={{ textAlign: "center", padding: "10px", display: window.innerWidth < 768 ? "none" : "block" }}>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Espace Discussion Classe</h1>
        </div>

        <div style={{ 
          flex: 1, 
          background: window.innerWidth < 768 ? "transparent" : "rgba(255,255,255,0.03)", 
          borderRadius: window.innerWidth < 768 ? "0" : "20px", 
          border: window.innerWidth < 768 ? "none" : "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative"
        }}>
          {/* Liste des messages */}
          <div style={{ 
            flex: 1, 
            overflowY: "auto", 
            padding: "1rem", 
            display: "flex", 
            flexDirection: "column", 
            gap: "0.8rem",
            WebkitOverflowScrolling: "touch"
          }}>
            {loading ? <Loader /> : (
              messages.length > 0 ? messages.map(m => {
                const isMe = m.sender?._id === user.id;
                const isStaff = ["teacher", "admin", "director"].includes(m.sender?.role);
                
                return (
                  <div key={m._id} style={{ 
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    width: "fit-content",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start",
                    maxWidth: "min(70%, 500px)"
                  }}>
                    {!isMe && (
                      <div style={{ fontSize: "0.65rem", opacity: 0.5, marginBottom: "2px", marginLeft: "4px", fontWeight: "bold", color: isStaff ? "var(--primary)" : "inherit" }}>
                        {m.sender?.fullName}
                      </div>
                    )}
                    <div style={{ 
                      padding: "8px 12px", 
                      borderRadius: "15px", 
                      borderTopRightRadius: isMe ? "2px" : "15px",
                      borderTopLeftRadius: !isMe ? "2px" : "15px",
                      background: isMe ? "var(--primary)" : (isStaff ? "rgba(26, 115, 232, 0.2)" : "rgba(255,255,255,0.08)"),
                      color: "white",
                      fontSize: "0.9rem",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      position: "relative"
                    }}>
                      {m.content}
                      <div style={{ fontSize: "0.55rem", opacity: 0.5, textAlign: "right", marginTop: "2px" }}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div style={{ textAlign: "center", opacity: 0.3, marginTop: "2rem" }}>
                   <p style={{ fontSize: "0.9rem" }}>Aucun message. Commencez la discussion !</p>
                </div>
              )
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Clavier d'emojis intégré */}
          {showEmojis && (
            <div style={{ 
              padding: "10px", 
              background: "rgba(20,20,20,0.95)", 
              backdropFilter: "blur(10px)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(35px, 1fr))",
              gap: "5px",
              maxHeight: "150px",
              overflowY: "auto",
              animation: "slideUp 0.2s ease"
            }}>
              {emojis.map(e => (
                <button 
                  key={e} 
                  onClick={() => addEmoji(e)}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    fontSize: "1.5rem", 
                    cursor: "pointer", 
                    padding: "5px",
                    borderRadius: "8px",
                    transition: "0.2s"
                  }}
                  onMouseOver={el => el.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseOut={el => el.currentTarget.style.background = "none"}
                >
                  {e}
                </button>
              ))}
            </div>
          )}

          {/* Zone de saisie */}
          <form onSubmit={handleSend} style={{ 
            padding: "10px", 
            background: "rgba(10,10,10,0.8)", 
            backdropFilter: "blur(10px)",
            display: "flex", 
            gap: "8px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
            alignItems: "center"
          }}>
            <button 
              type="button" 
              onClick={() => setShowEmojis(!showEmojis)}
              style={{ 
                background: "none", 
                border: "none", 
                color: showEmojis ? "var(--primary)" : "white", 
                cursor: "pointer", 
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "0.2s"
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </button>

            <input 
              type="text" 
              value={content} 
              onChange={e => setContent(e.target.value)}
              onFocus={() => setShowEmojis(false)}
              placeholder="Votre message..."
              style={{ flex: 1, padding: "10px 15px", borderRadius: "20px", background: "rgba(255,255,255,0.9)", color: "#222", border: "none", fontSize: "0.9rem" }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(10px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      </main>
    </>
  );
}

export default ClassroomChatPage;
