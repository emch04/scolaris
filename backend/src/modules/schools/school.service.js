// Import du modèle School
const School = require("./school.model");
// Récupérer toutes les écoles
const getAllSchools = async () => {
  // Retourne toutes les écoles triées par date décroissante
  return await School.find().sort({ createdAt: -1 });
};
// Créer une école
const createSchool = async (payload) => {
  // Création de l'école en base
  return await School.create(payload);
};
// Export
module.exports = {
  getAllSchools,
  createSchool
};
