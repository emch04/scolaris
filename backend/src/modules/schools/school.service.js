// Import du modèle School
const School = require("./school.model");
// Récupérer toutes les écoles
const getAllSchools = async (filter = {}) => {
  // Retourne toutes les écoles triées par date décroissante
  return await School.find(filter).sort({ createdAt: -1 });
};
// Récupérer une école par ID
const getSchoolById = async (id) => {
  return await School.findById(id);
};
// Créer une école
const createSchool = async (payload) => {
  // Création de l'école en base
  return await School.create(payload);
};

// Valider une école
const updateSchoolStatus = async (id, status) => {
  return await School.findByIdAndUpdate(id, { status }, { new: true });
};

// Export
module.exports = {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchoolStatus
};
