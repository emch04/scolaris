// Import utilitaires
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
// Import services
const { createAssignment, getAllAssignments } = require("./assignment.service");
const Classroom = require("../classrooms/classroom.model");
const Parent = require("../parents/parent.model");
// Créer devoir
const create = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  
  // Si un fichier est présent, on ajoute son URL au payload
  if (req.file) {
    // Si c'est Cloudinary, req.file.path contient l'URL complète
    // Sinon c'est local, et on garde le chemin relatif
    payload.fileUrl = req.file.path.includes("cloudinary") 
      ? req.file.path 
      : `/uploads/${req.file.filename}`;
  }

  // Appel du service
  const assignment = await createAssignment(payload);
  // Réponse de succès
  return apiResponse(res, 201, "Devoir créé avec succès.", assignment);
});
// Lister devoirs
const getAssignments = asyncHandler(async (req, res) => {
  const { classroom } = req.query;
  const filter = {};
  
  if (classroom) {
    filter.classroom = classroom;
  } else if (req.user.role === "parent") {
    // Pour les parents, on cherche les classes de leurs enfants
    const parent = await Parent.findById(req.user.id).populate("children", "classroom");
    if (parent && parent.children) {
      const classroomIds = parent.children
        .map(child => child.classroom)
        .filter(cid => cid != null);
      filter.classroom = { $in: classroomIds };
    }
  } else if (req.user.role !== "super_admin") {
    // Si pas super admin et pas de classe spécifiée, on filtre par l'école de l'utilisateur
    if (req.user.school) {
      const classrooms = await Classroom.find({ school: req.user.school }).select("_id");
      const classroomIds = classrooms.map(c => c._id);
      filter.classroom = { $in: classroomIds };
    }
  }

  // Appel du service
  const assignments = await getAllAssignments(filter);
  // Réponse
  return apiResponse(res, 200, "Liste des devoirs récupérée avec succès.", assignments);
});
// Export
module.exports = {
  create,
  getAssignments
};
