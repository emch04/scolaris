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

module.exports = { reportError, logError, getLogs, clearLogs };
