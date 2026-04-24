const jwt = require("jsonwebtoken");

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