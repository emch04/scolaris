// Import des utilitaires
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
// Import des services
const { createStudent, getAllStudents, getStudentDashboardData } = require("./student.service");
// Créer un élève
const create = asyncHandler(async (req, res) => {
  // On appelle le service de création
  const student = await createStudent(req.body);
  // Réponse de succès
  return apiResponse(res, 201, "Élève créé avec succès.", student);
});
/**
 * Récupère la liste des étudiants, filtrée par école pour les directeurs.
 */
const getStudents = asyncHandler(async (req, res) => {
  const filter = {};
  
  // Si ce n'est pas un Super Admin, on filtre par école
  if (req.user.role !== "super_admin") {
    filter.school = req.user.school;
  }

  // On récupère les élèves selon le filtre
  const students = await getAllStudents(filter);
  // Réponse
  return apiResponse(res, 200, "Liste des élèves récupérée avec succès.", students);
});

// Récupérer le dashboard d'un élève
const getDashboard = asyncHandler(async (req, res) => {
  // L'id de l'élève est dans req.user.id
  const data = await getStudentDashboardData(req.user.id);
  if (!data) return apiResponse(res, 404, "Élève non trouvé.");
  return apiResponse(res, 200, "Données du dashboard récupérées.", data);
});

// Export
module.exports = {
  create,
  getStudents,
  getDashboard
};
