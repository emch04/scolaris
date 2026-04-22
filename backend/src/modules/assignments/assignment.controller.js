// Import utilitaires
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
// Import services
const { createAssignment, getAllAssignments } = require("./assignment.service");
// Créer devoir
const create = asyncHandler(async (req, res) => {
  // Appel du service
  const assignment = await createAssignment(req.body);
  // Réponse de succès
  return apiResponse(res, 201, "Devoir créé avec succès.", assignment);
});
// Lister devoirs
const getAssignments = asyncHandler(async (req, res) => {
  // Appel du service
  const assignments = await getAllAssignments();
  // Réponse
  return apiResponse(res, 200, "Liste des devoirs récupérée avec succès.", assignments);
});
// Export
module.exports = {
  create,
  getAssignments
};
