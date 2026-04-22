// On importe validationResult pour récupérer les erreurs de validation
const { validationResult } = require("express-validator");
// Middleware de validation générique
const validateMiddleware = (req, res, next) => {
  // On récupère toutes les erreurs détectées
  const errors = validationResult(req);
  // S'il n'y a pas d'erreurs, on passe au middleware suivant
  if (errors.isEmpty()) {
    return next();
  }
  // Sinon on renvoie une erreur 400 avec le détail
  return res.status(400).json({
    success: false,
    message: "Erreur de validation",
    errors: errors.array()
  });
};
// Export
module.exports = validateMiddleware;
