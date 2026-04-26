const Config = require("./config.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

/**
 * Récupère la liste de tous les interrupteurs de fonctionnalités.
 */
const getConfigs = asyncHandler(async (req, res) => {
  const configs = await Config.find().sort({ category: 1 });
  return apiResponse(res, 200, "Configurations récupérées.", configs);
});

/**
 * Active ou désactive un module spécifique.
 */
const toggleFeature = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { enabled } = req.body;

  const config = await Config.findOneAndUpdate(
    { key },
    { enabled },
    { new: true }
  );

  if (!config) return apiResponse(res, 404, "Fonctionnalité non trouvée.");
  return apiResponse(res, 200, `Statut de '${config.label}' mis à jour.`, config);
});

module.exports = { getConfigs, toggleFeature };
