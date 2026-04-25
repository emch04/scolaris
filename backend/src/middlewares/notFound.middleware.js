/**
 * @fileoverview Middleware pour gérer les routes non trouvées (404).
 */

/**
 * Middleware appelé lorsqu'aucune route n'est trouvée pour une requête donnée.
 * 
 * @function notFoundMiddleware
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction suivante du middleware.
 */
const notFoundMiddleware = (req, res, next) => {
  // On renvoie une réponse 404
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.originalUrl}`
  });
};

// Export
module.exports = notFoundMiddleware;
