// Import du modèle Student
const Student = require("./student.model");
// Import du générateur de matricule
const generateMatricule = require("../../utils/generateMatricule");
// Créer un élève
const createStudent = async (payload) => {
  // On génère un matricule
  const matricule = generateMatricule();
  // On crée l'élève
  const student = await Student.create({
    ...payload,
    matricule
  });
  // On retourne l'élève créé
  return student;
};
// Récupérer tous les élèves
const getAllStudents = async () => {
  // On retourne la liste avec les relations utiles
  return await Student.find()
    .populate("school", "name code")
    .populate("classroom", "name level")
    .sort({ createdAt: -1 });
};
// Export
module.exports = {
  createStudent,
  getAllStudents
};
