// Import du modèle Teacher
const Teacher = require("./teacher.model");
// Retourner tous les enseignants
const getAllTeachers = async (filter = {}) => {
  // Recherche avec tri décroissant
  return await Teacher.find(filter).select("-password").sort({ createdAt: -1 });
};

// Supprimer un enseignant par son ID
const deleteTeacherById = async (id) => {
  return await Teacher.findByIdAndDelete(id);
};

// Export
module.exports = {
  getAllTeachers,
  deleteTeacherById
};
