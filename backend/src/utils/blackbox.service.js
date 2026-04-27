const os = require('os');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Modèles
const Student = require('../modules/students/student.model');
const School = require('../modules/schools/school.model');
const Result = require('../modules/results/result.model');
const Log = require('../modules/logs/log.model');
const Teacher = require('../modules/teachers/teacher.model');
const Attendance = require('../modules/attendance/attendance.model');
const HistorySnapshot = require('../modules/logs/snapshot.model');
const IAChat = require('../modules/logs/chat.model');
const gemini = require("./gemini.service");
const { getLastAlert } = require("../modules/logs/predictive.monitor");

/**
 * Service Scolaris IA v3.5 - "Total Recall"
 * Intelligence hybride avec mémoire persistante en base de données.
 */
class BlackBoxService {
  constructor() {
    this.logPath = path.join(__dirname, '../../logs/blackbox.log');
    this.ensureLogDir();
  }

  ensureLogDir() {
    const dir = path.dirname(this.logPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.logPath)) {
      fs.writeFileSync(this.logPath, `[${new Date().toLocaleString()}] Scolaris IA Initialisée - Mode Oracle Actif\n`);
    }
  }

  async _detectAnomalies() {
    const anomalies = [];
    const today = new Date();
    const lastWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    const absenceCount = await Attendance.countDocuments({ 
      status: 'absent', 
      date: { $gte: lastWeek } 
    });

    if (absenceCount > 500) {
      anomalies.push(`Alerte : Pic d'absentéisme détecté (${absenceCount} absences en 7 jours).`);
    }

    const health = this.getSystemHealth();
    if (health.ram > 85) {
      anomalies.push(`Surcharge mémoire (${health.ram}%).`);
    }

    const failingResults = await Result.countDocuments({ score: { $lt: 10 } });
    if (failingResults > 0) {
      const totalResults = await Result.countDocuments();
      const failRatio = (failingResults / totalResults) * 100;
      if (failRatio > 30) {
        anomalies.push(`Anomalie Académique : ${failRatio.toFixed(1)}% d'échec.`);
      }
    }

    return anomalies.length > 0 
      ? `J'ai détecté des points critiques : ` + anomalies.join(" ")
      : "Aucune anomalie détectée. Scolaris est en parfaite santé.";
  }

  async _getStrategicReport() {
    const totalStudents = await Student.countDocuments();
    const totalSchools = await School.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newSchools = await School.countDocuments({ createdAt: { $gte: thisMonth } });

    return `Scolaris gère ${totalStudents.toLocaleString()} élèves et ${totalTeachers.toLocaleString()} enseignants dans ${totalSchools.toLocaleString()} établissements. Croissance ce mois-ci : +${newSchools} nouvelles écoles.`;
  }

  async takeSnapshot() {
    try {
      const totalStudents = await Student.countDocuments();
      const totalSchools = await School.countDocuments();
      const totalTeachers = await Teacher.countDocuments();
      const stats = await Result.aggregate([{ $group: { _id: null, avg: { $avg: { $divide: ["$score", "$maxScore"] } } } }]);
      const avgSuccessRate = stats.length ? (stats[0].avg * 100) : 0;
      const health = this.getSystemHealth();

      const snapshot = new HistorySnapshot({
        metrics: {
          totalStudents, totalSchools, totalTeachers, avgSuccessRate,
          systemHealth: { cpu: parseFloat(health.cpu), ram: health.ram }
        },
        aiObservation: `Capture automatique`
      });
      await snapshot.save();
      return true;
    } catch (err) { return false; }
  }

  async _analyzeTrends() {
    const snapshots = await HistorySnapshot.find().sort({ date: -1 }).limit(2);
    if (snapshots.length < 2) {
      await this.takeSnapshot();
      return "Premier instantané pris. Revenez demain pour l'analyse de croissance.";
    }
    const current = snapshots[0].metrics;
    const previous = snapshots[1].metrics;
    const diffStudents = current.totalStudents - previous.totalStudents;
    const diffRate = (current.avgSuccessRate - previous.avgSuccessRate).toFixed(2);

    return `Analyse : ${diffStudents >= 0 ? '📈 +' : '📉 -'}${Math.abs(diffStudents)} élèves, ${diffRate >= 0 ? '⭐ +' : '⚠️ '}${diffRate}% de réussite.`;
  }

  async _predictEvolution() {
    const last30Days = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    const recentEnrollments = await Student.countDocuments({ createdAt: { $gte: last30Days } });
    const prediction6Months = Math.round((recentEnrollments / 30) * 180);
    return `Estimation : +${prediction6Months} élèves d'ici 6 mois sur la base de la tendance actuelle.`;
  }

  getSystemHealth() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemPercent = Math.round(((totalMem - freeMem) / totalMem) * 100);
    
    let diskFree = "N/A";
    try {
      const { execSync } = require('child_process');
      const output = execSync("df -h / | tail -1 | awk '{print $4}'").toString().trim();
      diskFree = output.replace('Gi', '').replace('G', '');
    } catch (e) { diskFree = "--"; }

    return { 
      ram: usedMemPercent, 
      cpu: os.loadavg()[0].toFixed(2), 
      disk: diskFree, 
      mood: usedMemPercent > 85 ? "critique" : "stable", 
      timestamp: new Date().toISOString(),
      activeAlert: getLastAlert()
    };
  }

  async _getDatabaseRAM() {
    const stats = await mongoose.connection.db.stats();
    const indexMB = (stats.indexSize / 1024 / 1024).toFixed(2);
    const dataMB = (stats.dataSize / 1024 / 1024).toFixed(2);
    const totalMB = (parseFloat(indexMB) + parseFloat(dataMB)).toFixed(2);
    return `Mémoire DB : ${totalMB} MB en RAM (${indexMB} MB index, ${dataMB} MB données). Statut: OPTIMAL.`;
  }

  /**
   * IA STRATÉGIQUE : Récupère une vue d'ensemble pour le raisonnement complexe
   */
  async _getSystemContext() {
    const totalStudents = await Student.countDocuments();
    const totalSchools = await School.countDocuments();
    const stats = await Result.aggregate([{ $group: { _id: null, avg: { $avg: { $divide: ["$score", "$maxScore"] } } } }]);
    const avgRate = stats.length ? (stats[0].avg * 100).toFixed(1) : "0";
    const health = this.getSystemHealth();
    
    return {
      totalStudents,
      totalSchools,
      avgRate,
      health,
      date: new Date().toLocaleString('fr-FR'),
      platform: "Scolaris RDC"
    };
  }

  async processCommand(command) {
    const cmd = command.toLowerCase();
    const timestamp = new Date().toLocaleString();
    let response = "";

    this.logEvent(`[${timestamp}] CONSIGNE : ${command}`);

    try {
      // 1. Commandes Techniques Locales (Priorité Haute/Vitesse)
      if (cmd.includes("ram base") || cmd.includes("mémoire base")) response = await this._getDatabaseRAM();
      else if (cmd.includes("nettoie") || cmd.includes("clean")) {
        const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
        const deleted = await Log.deleteMany({ createdAt: { $lt: sevenDaysAgo } });
        response = `Nettoyage réussi : ${deleted.deletedCount} logs supprimés.`;
      }
      // 2. Intelligence Augmentée (Gemini avec Conscience du Système)
      else {
        const context = await this._getSystemContext();
        response = await gemini.ask(command, [], context);
      }

      // 💾 SAUVEGARDE EN BASE POUR L'HISTORIQUE PERSISTANT
      await IAChat.create({ command, response });

    } catch (error) {
      response = `Erreur d'analyse : ${error.message}`;
    }

    this.logEvent(`[${timestamp}] RÉPONSE IA : ${response}`);
    return response;
  }

  logEvent(message) {
    fs.appendFileSync(this.logPath, message + '\n');
  }

  /**
   * Récupère l'historique structuré depuis la base de données
   */
  async getChatHistory() {
    const chats = await IAChat.find().sort({ createdAt: 1 }).limit(50);
    const history = [];
    chats.forEach(c => {
      const time = new Date(c.createdAt).toLocaleTimeString();
      history.push(`[${time}] CONSIGNE : ${c.command}`);
      history.push(`[${time}] RÉPONSE IA : ${c.response}`);
    });
    return history;
  }

  getRecentLogs() {
    if (!fs.existsSync(this.logPath)) return [];
    return fs.readFileSync(this.logPath, 'utf8').split('\n').filter(Boolean).slice(-15);
  }
}

module.exports = new BlackBoxService();
