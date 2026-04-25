const Communication = require("./communication.model");

/**
 * Crée une nouvelle communication.
 * @param {Object} payload - Données de la communication.
 * @returns {Promise<Object>} La communication créée.
 */
const createCommunication = async (payload) => {
  return await Communication.create(payload);
};

/**
 * Récupère les communications avec filtrage.
 * @param {Object} filter - Filtres de recherche.
 * @returns {Promise<Array>} Liste des communications.
 */
const getCommunications = async (filter = {}) => {
  return await Communication.find(filter)
    .populate("school", "name")
    .populate("classroom", "name level")
    .populate("author", "fullName")
    .populate("targetStudent", "fullName matricule")
    .sort({ createdAt: -1 });
};

module.exports = {
  createCommunication,
  getCommunications
};
