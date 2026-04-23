// Import utilitaires
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
// Import service
const { getAllTeachers } = require("./teacher.service");
// Liste enseignants
const getTeachers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role !== "super_admin") {
    filter.school = req.user.school;
  }

  // On récupère les enseignants
  const teachers = await getAllTeachers(filter);
  // Réponse
  return apiResponse(res, 200, "Liste des enseignants récupérée avec succès.", teachers);
});
// Export
module.exports = {
  getTeachers
};
