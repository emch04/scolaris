// Import du modèle School
const School = require("./school.model");

// Récupérer toutes les écoles (avec pagination et recherche)
const getAllSchools = async (filter = {}, skip = 0, limit = 20, search = "") => {
  const query = { ...filter };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } }
    ];
  }

  // Retourne les écoles triées par date décroissante, paginées
  return await School.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

// Compter le nombre total d'écoles (recherche incluse)
const countSchools = async (filter = {}, search = "") => {
  const query = { ...filter };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } }
    ];
  }

  return await School.countDocuments(query);
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

/**
 * Met à jour le statut (approuvé/rejeté) d'une école.
 */
const updateSchoolStatus = async (id, status) => {
  return await School.findByIdAndUpdate(id, { status }, { new: true });
};

/**
 * Met à jour le statut de toutes les écoles en attente.
 */
const bulkUpdateSchoolStatus = async (status) => {
  return await School.updateMany({ status: "pending" }, { status });
};

// Export
module.exports = {
  getAllSchools,
  countSchools,
  getSchoolById,
  createSchool,
  updateSchoolStatus,
  bulkUpdateSchoolStatus
};
