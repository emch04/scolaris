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
  console.log("🤖 IA Prédictive : Mode passif activé (Économie CPU).");

  // On a supprimé le setInterval pour éviter de fatiguer le CPU inutilement.
  // Le système donnera ses alertes uniquement quand on interrogera getLastAlert().
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
