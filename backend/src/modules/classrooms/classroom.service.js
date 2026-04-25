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
 * Récupère la liste des classes selon un filtre.
 * @async
 * @param {Object} [filter={}] - Filtre de recherche.
 * @returns {Promise<Array>} Liste des classes avec les détails de l'école et du titulaire.
 */
const getAllClassrooms = async (filter = {}) => {
  return await Classroom.find(filter)
    .populate("school", "name code")
    .populate("titularTeacher", "fullName email")
    .sort({ createdAt: -1 });
};

module.exports = {
  createClassroom,
  getAllClassrooms
};
