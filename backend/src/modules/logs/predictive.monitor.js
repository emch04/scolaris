/**
 * @file predictive.monitor.js
 * @description Analyse prédictive 24/7 du système Backend.
 */

const os = require('os');
const mongoose = require('mongoose');
const { logError } = require('./log.controller');

let isMonitoring = false;
let highCpuCount = 0;
let consecutiveSlowDb = 0;
let lastCriticalAlert = null; // Mémoire de l'alerte active

const startPredictiveMonitoring = () => {
  if (isMonitoring) return;
  isMonitoring = true;
  console.log("🤖 IA Prédictive activée : Surveillance active.");

  setInterval(async () => {
    try {
      const issues = [];
      let level = 'WARN';

      // 1. Analyse RAM
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMemPercentage = ((totalMem - freeMem) / totalMem) * 100;
      if (usedMemPercentage > 95) issues.push(`Surcharge RAM (${usedMemPercentage.toFixed(1)}%)`);

      // 2. Analyse CPU
      const cpus = os.cpus().length;
      const cpuLoad = (os.loadavg()[0] / cpus) * 100;
      if (cpuLoad > 90) issues.push(`Surcharge CPU (${cpuLoad.toFixed(1)}%)`);

      // 3. Base de données
      const dbState = mongoose.connection.readyState;
      if (dbState !== 1) {
        issues.push("Base de données déconnectée");
        level = 'FATAL';
      } else {
        const stats = await mongoose.connection.db.stats();
        const totalWorkingSet = (stats.indexSize + stats.dataSize) / 1024 / 1024;
        if (totalWorkingSet > 450) {
            issues.push(`Saturation Cache DB (${totalWorkingSet.toFixed(0)}MB)`);
            level = 'FATAL';
        }
      }

      // Gestion de l'alerte
      if (issues.length > 0) {
        const message = "🚨 ALERTE SYSTÈME : " + issues.join(" | ");
        lastCriticalAlert = { message, level, time: new Date() };
        
        await logError({
          message: message, level, url: 'System/PredictiveCore',
          user: { role: 'AI_Monitor', id: 'system' }
        });
      } else {
        // On efface l'alerte si tout est redevenu normal
        lastCriticalAlert = null;
      }

    } catch (err) { console.error("Monitor Error:", err.message); }
  }, 30000);
};

module.exports = { 
  startPredictiveMonitoring,
  getLastAlert: () => {
    // L'alerte est valide si elle a moins de 2 minutes
    if (lastCriticalAlert && (Date.now() - lastCriticalAlert.time < 120000)) {
        return lastCriticalAlert;
    }
    return null;
  }
};
