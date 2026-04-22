// Import du modèle Teacher
const Teacher = require("./teacher.model");
// Retourner tous les enseignants
const getAllTeachers = async () => {
  // Recherche avec tri décroissant
  return await Teacher.find().select("-password").sort({ createdAt: -1 });
};
// Export
module.exports = {
  getAllTeachers
};
