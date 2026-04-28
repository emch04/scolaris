const Config = require("./config.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const blackBox = require("../../utils/blackbox.service");
const fs = require("fs");
const path = require("path");

/**
 * Récupère la liste de tous les interrupteurs de fonctionnalités.
 */
const getConfigs = asyncHandler(async (req, res) => {
  const configs = await Config.find().sort({ category: 1 });
  return apiResponse(res, 200, "Configurations récupérées.", configs);
});

/**
 * Active ou désactive un module spécifique.
 */
const toggleFeature = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { enabled } = req.body;

  const config = await Config.findOneAndUpdate({ key }, { enabled }, { new: true });
  if (!config) return apiResponse(res, 404, "Fonctionnalité non trouvée.");
  return apiResponse(res, 200, `Statut de '${config.label}' mis à jour.`, config);
});

/**
 * Envoie une consigne directe à l'IA interne de Scolaris.
 */
const sendBlackBoxCommand = asyncHandler(async (req, res) => {
  const { command, imageData } = req.body;
  if (!command) return apiResponse(res, 400, "Aucune commande reçue.");

  // L'IA traite la commande instantanément (avec support Vision si imageData est présent)
  const response = await blackBox.processCommand(command, imageData);
  
  return apiResponse(res, 200, "Commande traitée.", response);
});

/**
 * Récupère les rapports et l'état de santé de l'IA.
 */
const getBlackBoxLogs = asyncHandler(async (req, res) => {
  const logs = await blackBox.getChatHistory(); // Historique persistant DB
  const health = blackBox.getSystemHealth();
  
  return apiResponse(res, 200, "Logs récupérés.", { logs, health });
});

/**
 * Réinitialise l'historique de l'IA.
 */
const clearBlackBoxLogs = asyncHandler(async (req, res) => {
  const logPath = blackBox.logPath;
  fs.writeFileSync(logPath, `[${new Date().toLocaleString()}] --- Historique réinitialisé par l'utilisateur ---\n`);
  return apiResponse(res, 200, "Historique de la Boîte Noire vidé.");
});

module.exports = { getConfigs, toggleFeature, sendBlackBoxCommand, getBlackBoxLogs, clearBlackBoxLogs };