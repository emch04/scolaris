import React, { useState, useEffect, useRef } from "react";
import apiClient from "../services/apiClient";
import { FaPaperPlane, FaMemory, FaMicrochip, FaDatabase, FaImage, FaTimes } from "react-icons/fa";

const ScolarisIA = () => {
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState({ ram: 0, cpu: 0, mood: "parfaite", disk: "--" });
  const [command, setCommand] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  // Chargement de l'historique complet au démarrage
  useEffect(() => {
    fetchHistory();
    // On ne rafraîchit que la santé, pas les logs (pour ne pas perturber la lecture)
    const interval = setInterval(fetchHealthOnly, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [logs]);

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/system-config/blackbox/report');
      if (res.data.success) {
        const data = res.data.data;
        setLogs(data.logs || []);
        setHealth(data.health || { mood: "parfaite" });
        
        if (data.health?.activeAlert) {
          const alertMsg = `[!] ALERTE IA PRÉDICTIVE : ${data.health.activeAlert.message}`;
          setLogs(prev => prev.some(l => l.includes(data.health.activeAlert.message)) ? prev : [...prev, alertMsg]);
        }
      }
    } catch (err) { console.error("History Load Error:", err); }
  };

  const fetchHealthOnly = async () => {
    if (loading) return;
    try {
      const res = await apiClient.get('/system-config/blackbox/report');
      if (res.data.success) {
        const data = res.data.data;
        setHealth(data.health);
        
        if (data.health?.activeAlert) {
          const alertMsg = `[!] ALERTE IA PRÉDICTIVE : ${data.health.activeAlert.message}`;
          setLogs(prev => prev.some(l => l.includes(data.health.activeAlert.message)) ? prev : [...prev, alertMsg]);
        }
      }
    } catch (err) { console.error(err); }
  };

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!command.trim() && !image) return;

    // Ajout local immédiat pour fluidité
    const time = new Date().toLocaleTimeString();
    const userMsg = `[${time}] CONSIGNE : ${command}${image ? " (IMAGE)" : ""}`;
    setLogs(prev => [...prev, userMsg]);
    
    const currentCommand = command;
    const currentImage = image;
    const currentPreview = imagePreview;

    setCommand("");
    setImage(null);
    setImagePreview(null);
    setLoading(true);

    try {
      let imageData = null;
      if (currentImage && currentPreview) {
        imageData = {
          inlineData: {
            data: currentPreview.split(",")[1],
            mimeType: currentImage.type
          }
        };
      }

      const res = await apiClient.post('/system-config/blackbox/command', { 
        command: currentCommand || "Analyse cette image", 
        imageData 
      });

      if (res.data.success) {
        const aiResponse = res.data.data;
        const aiMsg = `[${time}] RÉPONSE IA : ${aiResponse}`;
        setLogs(prev => [...prev, aiMsg]);
      }
    } catch (err) { 
      console.error(err);
      setLogs(prev => [...prev, "[!] Erreur critique de communication."]);
    } finally { 
      setLoading(false); 
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image trop lourde (max 5Mo)");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getThemeColor = () => {
    if (health?.activeAlert) return "#ff0000"; // Rouge vif si alerte
    const mood = health?.mood || "parfaite";
    return mood === "critique" ? "#ff4b2b" : mood === "un peu lourde" ? "#f9d423" : "#00d2ff";
  };

  return (
    <div className="ia-organic-card">
      <style>{`
        .ia-organic-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--border-radius);
          padding: 30px;
          color: #1e293b;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          font-family: 'Poppins', sans-serif;
        }
        .ia-identity { display: flex; flex-direction: column; align-items: center; margin-bottom: 30px; }
        .ia-orb {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${getThemeColor()}, #92fe9d);
          box-shadow: 0 0 30px ${getThemeColor()};
          animation: orb-float 4s infinite ease-in-out;
        }
        @keyframes orb-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .ia-name { margin-top: 10px; font-weight: 700; color: #1e293b; }
        
        .ia-metrics {
          display: flex;
          justify-content: space-around;
          background: rgba(0,0,0,0.03);
          padding: 15px;
          border-radius: 15px;
          margin-bottom: 25px;
        }
        .metric-item { text-align: center; }
        .metric-val { font-weight: 700; display: block; font-size: 1.1rem; }
        .metric-lbl { font-size: 0.6rem; text-transform: uppercase; color: #64748b; }

        .chat-zone {
          height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-right: 5px;
          margin-bottom: 20px;
        }
        .bubble {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 15px;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        .bubble-ai { align-self: flex-start; background: #f1f5f9; color: #334155; border-bottom-left-radius: 2px; }
        .bubble-user { align-self: flex-end; background: ${getThemeColor()}; color: white; border-bottom-right-radius: 2px; }

        .input-area {
          display: flex;
          background: #f8fafc;
          border-radius: 50px;
          padding: 5px 5px 5px 20px;
          border: 1px solid #e2e8f0;
        }
        .ia-text-input { flex: 1; background: transparent; border: none; outline: none; font-size: 0.9rem; }
        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${getThemeColor()};
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .image-preview-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px dashed #cbd5e1;
        }
        .preview-img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 8px;
        }
        .remove-img-btn {
          background: #ff5252;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.7rem;
        }
      `}</style>

      <div className="ia-identity">
        <div className="ia-orb"></div>
        <div className="ia-name">Scolaris IA</div>
      </div>

      <div className="ia-metrics">
        <div className="metric-item">
          <span className="metric-val">{health?.ram || 0}%</span>
          <span className="metric-lbl">RAM</span>
        </div>
        <div className="metric-item">
          <span className="metric-val">{health?.cpu || 0}</span>
          <span className="metric-lbl">CPU</span>
        </div>
        <div className="metric-item">
          <span className="metric-val">{health?.disk || "--"}GB</span>
          <span className="metric-lbl">LIBRE</span>
        </div>
      </div>

      <div className="chat-zone" ref={scrollRef}>
        {logs.length > 0 ? (
          logs.map((log, idx) => {
            const isAI = log.includes("RÉPONSE");
            const cleanText = log.split(" : ").slice(1).join(" : ");
            return (
              <div key={idx} className={`bubble ${isAI ? "bubble-ai" : "bubble-user"}`}>
                {cleanText}
              </div>
            );
          })
        ) : (
          <div className="bubble bubble-ai">Historique chargé. Je suis à votre écoute, Emch.</div>
        )}
        {loading && <div className="bubble bubble-ai" style={{opacity: 0.5}}>...</div>}
      </div>

      {imagePreview && (
        <div className="image-preview-container">
          <img src={imagePreview} alt="Preview" className="preview-img" />
          <span style={{ fontSize: "0.8rem", flex: 1, opacity: 0.7 }}>Image prête pour l'analyse</span>
          <button onClick={removeImage} className="remove-img-btn"><FaTimes /></button>
        </div>
      )}

      <form onSubmit={handleCommand} className="input-area">
        <input 
          type="file" 
          hidden 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleImageChange} 
        />
        <button 
          type="button" 
          className="send-btn" 
          style={{ background: "transparent", color: "#64748b", marginRight: "10px" }}
          onClick={() => fileInputRef.current.click()}
        >
          <FaImage />
        </button>
        <input 
          className="ia-text-input"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Message ou document à analyser..."
        />
        <button type="submit" className="send-btn" disabled={loading}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ScolarisIA;
