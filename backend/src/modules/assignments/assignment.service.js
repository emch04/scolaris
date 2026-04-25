/**
 * @module Assignments/Service
 * @description Service gérant la logique métier des devoirs (création, récupération).
 */

const Assignment = require("./assignment.model");

/**
 * Crée un nouveau devoir.
 * @async
 * @function createAssignment
 * @param {Object} payload - Données du devoir.
 * @returns {Promise<Object>} Le devoir créé.
 */
const createAssignment = async (payload) => {
  return await Assignment.create(payload);
};

/**
 * Récupère tous les devoirs correspondant à un filtre.
 * @async
 * @function getAllAssignments
 * @param {Object} [filter={}] - Critères de recherche.
 * @returns {Promise<Array>} Liste des devoirs avec détails de la classe et de l'enseignant.
 */
const getAllAssignments = async (filter = {}) => {
  return await Assignment.find(filter)
    .populate("classroom", "name level")
    .populate("teacher", "fullName email")
    .sort({ createdAt: -1 });
};

module.exports = {
  createAssignment,
  getAllAssignments
};
