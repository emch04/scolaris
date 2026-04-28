/**
 * @file proxyAuth.js
 * @description Décode l'utilisateur transmis par le Backend proxy
 */

exports.parseProxyUser = (req, res, next) => {
  const userData = req.headers['x-user-data'];
  if (userData) {
    try {
      req.user = JSON.parse(userData);
    } catch (e) {
      return res.status(401).json({ success: false, message: "Données utilisateur invalides" });
    }
  } else {
    return res.status(401).json({ success: false, message: "Aucune identité transmise par le proxy" });
  }
  next();
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Rôle non autorisé pour cette transaction." });
    }
    next();
  };
};
