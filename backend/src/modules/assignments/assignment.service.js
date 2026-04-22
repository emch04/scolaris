// Import modèle
const Assignment = require("./assignment.model");
// Créer un devoir
const createAssignment = async (payload) => {
  // Création en base
  return await Assignment.create(payload);
};
// Lister devoirs
const getAllAssignments = async () => {
  // On charge les relations utiles
  return await Assignment.find()
    .populate("classroom", "name level")
    .populate("teacher", "fullName email")
    .sort({ createdAt: -1 });
};
// Export
module.exports = {
  createAssignment,
  getAllAssignments
};
