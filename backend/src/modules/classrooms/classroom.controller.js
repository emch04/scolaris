/**
 * @module Classrooms/Controller
 * @description Contrôleur gérant les requêtes HTTP liées aux salles de classe.
 */

const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { createClassroom, getAllClassrooms, countClassrooms } = require("./classroom.service");

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
 * Inclut la pagination et la recherche.
 * @async
 * @function getClassrooms
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express.
 * @returns {Promise<void>}
 */
const getClassrooms = asyncHandler(async (req, res) => {
  const filter = {};
  if (!["hero_admin", "super_admin"].includes(req.user.role)) {
    filter.school = req.user.school;
  }

  // Paramètres de pagination et recherche
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  // Récupération des données et du total en parallèle
  const [classrooms, total] = await Promise.all([
    getAllClassrooms(filter, skip, limit, search),
    countClassrooms(filter, search)
  ]);

  return apiResponse(res, 200, "Liste des classes récupérée avec succès.", {
    classrooms,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
});

module.exports = {
  create,
  getClassrooms
};
