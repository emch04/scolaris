const fs = require('fs');
const path = require('path');
const Log = require('./log.model');
const asyncHandler = require('../../utils/asyncHandler');
const apiResponse = require('../../utils/apiResponse');
const jwt = require('jsonwebtoken');

const LOG_FILE = path.join(__dirname, '../../../logs/system.log');

/**
 * Enregistre une erreur dans MongoDB et dans le fichier local.
 */
const logError = async (errorData) => {
  try {
    await Log.create(errorData);

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${errorData.level || 'ERROR'}] ${errorData.message}\n` +
                     `URL: ${errorData.url || 'N/A'}\n` +
                     `User: ${JSON.stringify(errorData.user || 'Guest')}\n` +
                     `--------------------------------------------------\n`;
    
    if (fs.existsSync(path.dirname(LOG_FILE))) {
      fs.appendFileSync(LOG_FILE, logEntry);
    }
    
    console.log(`✅ Incident enregistré : ${errorData.message}`);
  } catch (err) {
    console.error("❌ ERREUR SYSTÈME DE LOGS:", err.message);
  }
};

/**
 * Endpoint pour recevoir les crashs du frontend.
 */
const reportError = asyncHandler(async (req, res) => {
  const { message, stack, url, level } = req.body;
  
  let user = 'Guest';
  const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1]);
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = { id: decoded.id, role: decoded.role };
    } catch (e) {
      // Ignorer
    }
  }

  await logError({
    message,
    stack,
    url,
    level: level || 'FATAL',
    user,
    userAgent: req.headers['user-agent'],
    ip: req.ip
  });

  return apiResponse(res, 200, "Rapport d'incident reçu.");
});

/**
 * Récupère la liste des derniers incidents (Super Admin).
 */
const getLogs = asyncHandler(async (req, res) => {
  const logs = await Log.find().sort({ createdAt: -1 }).limit(50);
  return apiResponse(res, 200, "Journal des incidents récupéré.", logs);
});

/**
 * Vide le journal des incidents (Super Admin).
 */
const clearLogs = asyncHandler(async (req, res) => {
  await Log.deleteMany({});
  return apiResponse(res, 200, "Journal vidé avec succès.");
});

/**
 * Marque un incident comme résolu.
 */
const resolveLog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const log = await Log.findByIdAndUpdate(
    id, 
    { resolved: true, resolvedAt: new Date(), level: 'INFO' }, 
    { new: true }
  );

  if (!log) throw new Error("Incident non trouvé.");

  // On log l'action de résolution dans le fichier système
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [RESOLVED] Incident ${id} marqué comme résolu.\n` +
                   `Message: ${log.message}\n` +
                   `--------------------------------------------------\n`;
  
  if (fs.existsSync(path.dirname(LOG_FILE))) {
    fs.appendFileSync(LOG_FILE, logEntry);
  }

  return apiResponse(res, 200, "Incident marqué comme résolu.", log);
});

/**
 * Marque automatiquement les incidents comme résolus pour un utilisateur ou un motif.
 */
const autoResolveLogs = async (criteria) => {
  try {
    const query = { resolved: false };
    if (criteria.userId) query["user.id"] = criteria.userId;
    if (criteria.messagePattern) query.message = { $regex: criteria.messagePattern, $options: 'i' };

    const result = await Log.updateMany(
      query,
      { resolved: true, resolvedAt: new Date(), level: 'INFO' }
    );

    if (result.modifiedCount > 0) {
      console.log(`🤖 Boîte Noire : ${result.modifiedCount} incident(s) résolu(s) automatiquement.`);
    }
    return result.modifiedCount;
  } catch (err) {
    console.error("❌ Échec de l'auto-résolution :", err.message);
    return 0;
  }
};

module.exports = { reportError, logError, getLogs, clearLogs, resolveLog, autoResolveLogs };
