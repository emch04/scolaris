// Import modèle
const Classroom = require("./classroom.model");
// Créer une classe
const createClassroom = async (payload) => {
  // Création en base
  return await Classroom.create(payload);
};
// Lister classes
const getAllClassrooms = async () => {
  // Retourne classes avec école et titulaire
  return await Classroom.find()
    .populate("school", "name code")
    .populate("titularTeacher", "fullName email")
    .sort({ createdAt: -1 });
};
// Export
module.exports = {
  createClassroom,
  getAllClassrooms
};
