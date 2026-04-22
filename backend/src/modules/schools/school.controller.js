// Import des utilitaires
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
// Import des services
const { getAllSchools, createSchool } = require("./school.service");
// Lister les écoles
const getSchools = asyncHandler(async (req, res) => {
  // On récupère la liste
  const schools = await getAllSchools();
  // Réponse
  return apiResponse(res, 200, "Liste des écoles récupérée avec succès.", schools);
});
// Ajouter une école
const create = asyncHandler(async (req, res) => {
  // Création de l'école
  const school = await createSchool(req.body);
  // Réponse
  return apiResponse(res, 201, "École créée avec succès.", school);
});
// Export
module.exports = {
  getSchools,
  create
};
