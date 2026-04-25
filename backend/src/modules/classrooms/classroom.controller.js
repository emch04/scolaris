/**
 * @module Classrooms/Controller
 * @description Contrôleur gérant les requêtes HTTP liées aux salles de classe.
 */

const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { createClassroom, getAllClassrooms } = require("./classroom.service");

/**
 * Crée une nouvelle classe.
 * @async
 * @function create
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express.
 * @returns {Promise<void>}
 */
const create = asyncHandler(async (req, res) => {
  const classroom = await createClassroom(req.body);
  return apiResponse(res, 201, "Classe créée avec succès.", classroom);
});

/**
 * Récupère la liste des classes, filtrée par école si l'utilisateur n'est pas super-admin.
 * @async
 * @function getClassrooms
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express.
 * @returns {Promise<void>}
 */
const getClassrooms = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role !== "super_admin") {
    filter.school = req.user.school;
  }

  const classrooms = await getAllClassrooms(filter);
  return apiResponse(res, 200, "Liste des classes récupérée avec succès.", classrooms);
});

module.exports = {
  create,
  getClassrooms
};
