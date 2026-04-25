/**
 * @module Assignments/Controller
 * @description Contrôleur gérant les requêtes HTTP liées aux devoirs.
 */

const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { createAssignment, getAllAssignments } = require("./assignment.service");
const Classroom = require("../classrooms/classroom.model");
const Parent = require("../parents/parent.model");

/**
 * Crée un nouveau devoir avec possibilité de fichier joint.
 * @async
 * @function create
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express.
 * @returns {Promise<void>}
 */
const create = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  
  if (req.file) {
    payload.fileUrl = req.file.path.includes("cloudinary") 
      ? req.file.path 
      : `/uploads/${req.file.filename}`;
  }

  const assignment = await createAssignment(payload);
  return apiResponse(res, 201, "Devoir créé avec succès.", assignment);
});

/**
 * Récupère la liste des devoirs selon le rôle de l'utilisateur et les filtres fournis.
 * @async
 * @function getAssignments
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express.
 * @returns {Promise<void>}
 */
const getAssignments = asyncHandler(async (req, res) => {
  const { classroom } = req.query;
  const filter = {};
  
  if (classroom) {
    filter.classroom = classroom;
  } else if (req.user.role === "parent") {
    const parent = await Parent.findById(req.user.id).populate("children", "classroom");
    if (parent && parent.children) {
      const classroomIds = parent.children
        .map(child => child.classroom)
        .filter(cid => cid != null);
      filter.classroom = { $in: classroomIds };
    }
  } else if (req.user.role !== "super_admin") {
    if (req.user.school) {
      const classrooms = await Classroom.find({ school: req.user.school }).select("_id");
      const classroomIds = classrooms.map(c => c._id);
      filter.classroom = { $in: classroomIds };
    }
  }

  const assignments = await getAllAssignments(filter);
  return apiResponse(res, 200, "Liste des devoirs récupérée avec succès.", assignments);
});

module.exports = {
  create,
  getAssignments
};
