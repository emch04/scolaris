/**
 * @fileoverview Utilitaire pour capturer les erreurs asynchrones dans les contrôleurs Express.
 */

/**
 * Enveloppe une fonction asynchrone pour passer automatiquement les erreurs au middleware d'erreur.
 * 
 * @function asyncHandler
 * @param {Function} handler - Le contrôleur ou middleware asynchrone à envelopper.
 * @returns {Function} Un middleware Express qui gère la capture d'erreurs.
 */
const asyncHandler = (handler) => {
  // On retourne une nouvelle fonction middleware Express
  return (req, res, next) => {
    // On exécute la fonction et on attrape automatiquement les erreurs
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

// Export de la fonction
module.exports = asyncHandler;
