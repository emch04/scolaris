/**
 * @fileoverview Middlewares d'authentification et d'autorisation basés sur JWT.
 */

const jwt = require("jsonwebtoken");

/**
 * Middleware pour authentifier un utilisateur via un token JWT.
 * Vérifie le token dans les cookies ou l'en-tête Authorization.
 * 
 * @function authMiddleware
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction suivante du middleware.
 * @returns {Object|void} Renvoie une erreur 401 si non authentifié.
 */
const authMiddleware = (req, res, next) => {
  try {
    // Lecture du token dans les cookies OU dans le header Authorization
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé. Session expirée ou manquante."
      });
    }

    // Utilisation de JWT_SECRET pour correspondre au fichier .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré."
    });
  }
};

/**
 * Middleware pour autoriser l'accès en fonction des rôles de l'utilisateur.
 * 
 * @function authorizeRoles
 * @param {...string} allowedRoles - Liste des rôles autorisés à accéder à la ressource.
 * @returns {Function} Un middleware Express pour vérifier le rôle de l'utilisateur.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Accès interdit. Permission insuffisante."
      });
    }

    next();
  };
};

module.exports = authMiddleware;
module.exports.authorizeRoles = authorizeRoles;
