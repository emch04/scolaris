/**
 * @fileoverview Middleware global pour la gestion centralisée des erreurs dans Express.
 */

/**
 * Capture toutes les erreurs et renvoie une réponse JSON standardisée.
 * 
 * @function errorMiddleware
 * @param {Error} err - L'objet d'erreur capturé.
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction suivante du middleware.
 */
const errorMiddleware = (err, req, res, next) => {
  // Code HTTP par défaut si l'erreur n'en précise pas
  const statusCode = err.statusCode || 500;
  // Message par défaut
  const message = err.message || "Erreur interne du serveur";
  // Réponse JSON d'erreur
  res.status(statusCode).json({
    success: false,
    message,
    // On affiche la stack seulement en développement
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

// Export
module.exports = errorMiddleware;
