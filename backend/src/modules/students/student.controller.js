// Import des utilitaires
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
// Import des services
const { createStudent, getAllStudents } = require("./student.service");
// Créer un élève
const create = asyncHandler(async (req, res) => {
  // On appelle le service de création
  const student = await createStudent(req.body);
  // Réponse de succès
  return apiResponse(res, 201, "Élève créé avec succès.", student);
});
// Lister les élèves
const getStudents = asyncHandler(async (req, res) => {
  // On récupère tous les élèves
  const students = await getAllStudents();
  // Réponse
  return apiResponse(res, 200, "Liste des élèves récupérée avec succès.", students);
});
// Export
module.exports = {
  create,
  getStudents
};
