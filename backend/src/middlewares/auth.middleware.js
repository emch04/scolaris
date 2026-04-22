// On importe jsonwebtoken pour vérifier le token
const jwt = require("jsonwebtoken");
// Middleware qui protège les routes privées
const authMiddleware = (req, res, next) => {
  try {
    // On récupère le header Authorization
    const authHeader = req.headers.authorization;
    // Si le header n'existe pas ou ne commence pas par Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé. Token manquant."
      });
    }
    // On extrait le token en retirant "Bearer "
    const token = authHeader.split(" ")[1];
    // On vérifie et décode le token avec le secret JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // On injecte les infos décodées dans la requête
    req.user = decoded;
    // On continue vers la suite
    next();
  } catch (error) {
    // Si le token est invalide ou expiré
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré."
    });
  }
};
// Export
module.exports = authMiddleware;
