// Import utilitaires
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
// Import service
const { getAllTeachers, getTeacherById, updateTeacherById, deleteTeacherById } = require("./teacher.service");

const Student = require("../students/student.model");
const Parent = require("../parents/parent.model");

// Liste enseignants
const getTeachers = asyncHandler(async (req, res) => {
  const filter = {};
  
  if (req.user.role === "super_admin") {
    // Voit tout
  } else if (req.user.role === "parent") {
    // Un parent voit les profs des écoles de ses enfants
    const parent = await Parent.findById(req.user.id);
    if (!parent) return apiResponse(res, 404, "Parent non trouvé.");
    
    const students = await Student.find({ _id: { $in: parent.children } });
    const schoolIds = students.map(s => s.school).filter(s => s != null);
    filter.school = { $in: schoolIds };
  } else {
    // Admin/Directeur/Enseignant voit son école
    filter.school = req.user.school;
  }

  // On récupère les enseignants
  const teachers = await getAllTeachers(filter);
  // Réponse
  return apiResponse(res, 200, "Liste des enseignants récupérée avec succès.", teachers);
});

// Récupérer un enseignant
const getTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacher = await getTeacherById(id);
  
  if (!teacher) {
    return apiResponse(res, 404, "Enseignant non trouvé.");
  }

  return apiResponse(res, 200, "Détails de l'enseignant récupérés.", teacher);
});

// Mettre à jour un enseignant
const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacher = await updateTeacherById(id, req.body);
  
  if (!teacher) {
    return apiResponse(res, 404, "Enseignant non trouvé.");
  }

  return apiResponse(res, 200, "Enseignant mis à jour avec succès.", teacher);
});

// Supprimer un enseignant
const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteTeacherById(id);
  
  if (!deleted) {
    return apiResponse(res, 404, "Membre du personnel non trouvé.");
  }

  return apiResponse(res, 200, "Membre du personnel supprimé avec succès.");
});

// Export
module.exports = {
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher
};
