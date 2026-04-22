// Fonction utilitaire pour éviter de répéter try/catch dans chaque controller
const asyncHandler = (handler) => {
  // On retourne une nouvelle fonction middleware Express
  return (req, res, next) => {
    // On exécute la fonction et on attrape automatiquement les erreurs
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

// Export de la fonction
module.exports = asyncHandler;