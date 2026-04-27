/**
 * @file predictive.monitor.js
 * @description Analyse prédictive 24/7 du système Backend.
 * Détecte les surcharges CPU, RAM, ou latence Base de Données avant qu'un crash ne survienne.
 */

const os = require('os');
const mongoose = require('mongoose');
const { logError } = require('./log.controller');

let isMonitoring = false;
let highCpuCount = 0;
let consecutiveSlowDb = 0;

const startPredictiveMonitoring = () => {
  if (isMonitoring) return;
  isMonitoring = true;
  console.log("🤖 IA Prédictive (Boîte Noire) activée : Analyse système 24/7 en cours...");

  setInterval(async () => {
    try {
      const issues = [];
      let level = 'WARN';

      // 1. Analyse de la RAM (Alerte si > 90% d'utilisation réelle)
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      // Sur macOS, freeMem est souvent bas, on check plutôt si c'est vraiment critique
      const usedMemPercentage = ((totalMem - freeMem) / totalMem) * 100;
      
      if (usedMemPercentage > 95) {
        // Tentative de forcer la libération de mémoire si Node est lancé avec --expose-gc
        if (global.gc) {
          console.log("🧹 IA : Déclenchement du Garbage Collection forcé...");
          global.gc();
        }
        issues.push(`Alerte RAM critique (${usedMemPercentage.toFixed(1)}% occupés). Fermez les applications inutiles.`);
      }

      // 2. Analyse CPU (Simplifiée via Load Average 1min par rapport au nb de coeurs)
      const cpus = os.cpus().length;
      const loadAvg = os.loadavg()[0]; // Charge sur 1 minute
      const cpuLoadPercentage = (loadAvg / cpus) * 100;

      if (cpuLoadPercentage > 90) {
        highCpuCount++;
        if (highCpuCount >= 3) {
          issues.push(`Surcharge CPU détectée sur 3 cycles (${cpuLoadPercentage.toFixed(1)}% de charge)`);
          level = 'FATAL'; // Danger critique de gel du serveur
        }
      } else {
        highCpuCount = 0;
      }

      // 3. Analyse de la connexion Base de Données
      const dbState = mongoose.connection.readyState;
      if (dbState !== 1) { // 1 = connected
        consecutiveSlowDb++;
        issues.push(`Perte de stabilité de la Base de Données (État Mongoose: ${dbState})`);
        level = 'FATAL';
      } else {
        // Test de latence DB (Ping)
        const startPing = Date.now();
        await mongoose.connection.db.admin().ping();
        const latency = Date.now() - startPing;
        
        if (latency > 1500) { // > 1.5s pour un ping c'est énorme
          consecutiveSlowDb++;
          if (consecutiveSlowDb >= 2) {
            issues.push(`Latence critique Base de Données détectée (${latency}ms). Risque de timeout global.`);
          }
        } else {
          consecutiveSlowDb = 0;
        }
      }

      // Si des anomalies sont détectées, on informe la Boîte Noire PROACTIVEMENT
      if (issues.length > 0) {
        const message = "🔮 [PRÉDICTION IA] " + issues.join(" | ");
        console.log("\x1b[31m%s\x1b[0m", message);
        
        await logError({
          message: message,
          level: level,
          url: 'System/PredictiveCore',
          user: { role: 'AI_Monitor', id: 'system' },
          userAgent: `Node.js ${process.version} / ${os.type()}`,
          ip: '127.0.0.1'
        });
      }

    } catch (err) {
      console.error("Erreur de l'IA Prédictive :", err.message);
    }
  }, 30000); // Check toutes les 30 secondes
};

module.exports = { startPredictiveMonitoring };
