/**
 * @fileoverview Utilitaire pour standardiser les réponses de succès de l'API.
 */

/**
 * Envoie une réponse JSON standardisée pour les succès.
 * 
 * @function apiResponse
 * @param {Object} res - Objet de réponse Express.
 * @param {number} statusCode - Code de statut HTTP.
 * @param {string} message - Message de succès à envoyer au client.
 * @param {Object|Array|null} [data=null] - Données optionnelles à inclure dans la réponse.
 * @returns {Object} La réponse Express envoyée.
 */
const apiResponse = (res, statusCode, message, data = null) => {
  // On envoie toujours une structure cohérente
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Export
module.exports = apiResponse;
