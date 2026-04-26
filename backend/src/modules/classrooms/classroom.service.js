/**
 * @module Classrooms/Service
 * @description Service gérant la logique métier des classes (création, listage).
 */

const Classroom = require("./classroom.model");

/**
 * Crée une nouvelle salle de classe.
 * @async
 * @param {Object} payload - Données de la classe (name, level, school, titularTeacher).
 * @returns {Promise<Object>} La classe créée.
 */
const createClassroom = async (payload) => {
  return await Classroom.create(payload);
};

/**
 * Récupère la liste des classes selon un filtre avec pagination et recherche.
 * @async
 * @param {Object} [filter={}] - Filtre de recherche.
 * @param {number} [skip=0] - Nombre d'éléments à ignorer.
 * @param {number} [limit=20] - Nombre maximum d'éléments à retourner.
 * @param {string} [search=""] - Terme de recherche (nom ou niveau).
 * @returns {Promise<Array>} Liste des classes avec les détails de l'école et du titulaire.
 */
const getAllClassrooms = async (filter = {}, skip = 0, limit = 20, search = "") => {
  const query = { ...filter };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { level: { $regex: search, $options: "i" } }
    ];
  }

  return await Classroom.find(query)
    .populate("school", "name code")
    .populate("titularTeacher", "fullName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

/**
 * Compte le nombre total de classes selon un filtre et recherche.
 * @async
 * @param {Object} [filter={}] - Filtre de recherche.
 * @param {string} [search=""] - Terme de recherche.
 * @returns {Promise<number>} Nombre total de classes.
 */
const countClassrooms = async (filter = {}, search = "") => {
  const query = { ...filter };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { level: { $regex: search, $options: "i" } }
    ];
  }

  return await Classroom.countDocuments(query);
};

module.exports = {
  createClassroom,
  getAllClassrooms,
  countClassrooms
};
