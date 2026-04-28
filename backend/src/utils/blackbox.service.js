const os = require('os');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

/**
 * Service Scolaris Proxy IA - "The Bridge"
 * Délègue l'intelligence lourde au service scolaris-ia externe
 * pour préserver la RAM du backend principal.
 */
class BlackBoxService {
  constructor() {
    this.logPath = path.join(__dirname, '../../logs/blackbox.log');
    this.iaServiceUrl = process.env.IA_SERVICE_URL || "http://localhost:5002";
    this.ensureLogDir();
  }

  ensureLogDir() {
    const dir = path.dirname(this.logPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.logPath)) {
      fs.writeFileSync(this.logPath, `[${new Date().toLocaleString()}] Pont IA Initialisé - Délégation Active\n`);
    }
  }

  /**
   * Délègue le traitement de la commande au service IA externe
   * Supporte maintenant la Vision (imageData)
   */
  async processCommand(command, imageData = null) {
    const timestamp = new Date().toLocaleString();
    this.logEvent(`[${timestamp}] CONSIGNE (DÉLÉGUÉE) : ${command} ${imageData ? '(IMAGE)' : ''}`);

    try {
      const response = await axios.post(`${this.iaServiceUrl}/api/ia/command`, {
        command,
        imageData
      }, { timeout: 30000 });

      const iaResponse = response.data.data;
      this.logEvent(`[${timestamp}] RÉPONSE IA : ${iaResponse}`);
      return iaResponse;
    } catch (error) {
      console.error("Erreur de liaison IA Service:", error.message);
      return `⚠️ Le module IA externe est injoignable. (Vérifiez ${this.iaServiceUrl})`;
    }
  }

  /**
   * Récupère l'historique depuis le service IA
   */
  async getChatHistory() {
    try {
      const response = await axios.get(`${this.iaServiceUrl}/api/ia/history`);
      return response.data.data;
    } catch (e) {
      console.error("Erreur récupération historique IA:", e.message);
      return this.getRecentLogs(); // Fallback sur les logs locaux si distant échoue
    }
  }

  getSystemHealth() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemPercent = Math.round(((totalMem - freeMem) / totalMem) * 100);
    
    return { 
      ram: usedMemPercent, 
      cpu: os.loadavg()[0].toFixed(2), 
      mood: usedMemPercent > 85 ? "critique" : "stable", 
      timestamp: new Date().toISOString()
    };
  }

  // Utilisé par server.js pour les snapshots quotidiens
  async takeSnapshot() {
    try {
      // On demande au service IA de prendre le snapshot puisqu'il a accès à la DB
      await axios.get(`${this.iaServiceUrl}/status`); // Juste pour vérifier si vivant
      // Pour l'instant on laisse le service IA gérer ses propres snapshots ou on l'appelle
      return true;
    } catch (err) { return false; }
  }

  logEvent(message) {
    fs.appendFileSync(this.logPath, message + '\n');
  }

  getRecentLogs() {
    if (!fs.existsSync(this.logPath)) return [];
    return fs.readFileSync(this.logPath, 'utf8').split('\n').filter(Boolean).slice(-15);
  }
}

module.exports = new BlackBoxService();
