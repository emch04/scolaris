// Import utilitaires
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
// Import services
const { createClassroom, getAllClassrooms } = require("./classroom.service");
// Créer classe
const create = asyncHandler(async (req, res) => {
  // Appel service
  const classroom = await createClassroom(req.body);
  // Réponse
  return apiResponse(res, 201, "Classe créée avec succès.", classroom);
});
// Lister classes
const getClassrooms = asyncHandler(async (req, res) => {
  // Appel service
  const classrooms = await getAllClassrooms();
  // Réponse
  return apiResponse(res, 200, "Liste des classes récupérée avec succès.", classrooms);
});
// Export
module.exports = {
  create,
  getClassrooms
};
