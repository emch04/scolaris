// Import du modèle Teacher
const Teacher = require("./teacher.model");

// Retourner tous les enseignants
const getAllTeachers = async (filter = {}) => {
  // Recherche avec tri décroissant
  return await Teacher.find(filter).select("-password").sort({ createdAt: -1 });
};

// Récupérer un enseignant par son ID
const getTeacherById = async (id) => {
  return await Teacher.findById(id).select("-password");
};

// Mettre à jour un enseignant
const updateTeacherById = async (id, updateData) => {
  return await Teacher.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
};

// Supprimer un enseignant par son ID
const deleteTeacherById = async (id) => {
  return await Teacher.findByIdAndDelete(id);
};

// Export
module.exports = {
  getAllTeachers,
  getTeacherById,
  updateTeacherById,
  deleteTeacherById
};
