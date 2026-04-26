const Config = require("../modules/config/config.model");
const apiResponse = require("../utils/apiResponse");

/**
 * Middleware pour bloquer l'accès à une route si la fonctionnalité est désactivée.
 * Affiche un message clair à l'utilisateur.
 */
const featureGuard = (featureKey) => {
  return async (req, res, next) => {
    try {
      const config = await Config.findOne({ key: featureKey });
      
      if (config && !config.enabled) {
        return apiResponse(res, 403, `Service Temporairement Indisponible : Le module '${config.label}' a été désactivé par l'administrateur suprême pour maintenance ou mise à jour.`);
      }
      
      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = featureGuard;
