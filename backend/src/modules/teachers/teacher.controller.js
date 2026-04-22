// Import utilitaires
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
// Import service
const { getAllTeachers } = require("./teacher.service");
// Liste enseignants
const getTeachers = asyncHandler(async (req, res) => {
  // On récupère les enseignants
  const teachers = await getAllTeachers();
  // Réponse
  return apiResponse(res, 200, "Liste des enseignants récupérée avec succès.", teachers);
});
// Export
module.exports = {
  getTeachers
};
