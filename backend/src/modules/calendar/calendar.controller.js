/**
 * @module Calendar/Controller
 * @description Contrôleur gérant les requêtes HTTP liées au calendrier.
 */

const Calendar = require("./calendar.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

/**
 * Ajoute un nouvel événement au calendrier.
 * @async
 * @function addEvent
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express.
 * @returns {Promise<void>}
 */
const addEvent = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.user.role !== "super_admin") payload.school = req.user.school;
  
  const event = await Calendar.create(payload);
  return apiResponse(res, 201, "Événement ajouté au calendrier.", event);
});

/**
 * Récupère les événements du calendrier accessibles à l'utilisateur.
 * @async
 * @function getCalendar
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express.
 * @returns {Promise<void>}
 */
const getCalendar = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.school) {
    filter.$or = [{ school: req.user.school }, { school: null }];
  }
  const events = await Calendar.find(filter).sort({ date: 1 });
  return apiResponse(res, 200, "Calendrier récupéré.", events);
});

module.exports = { addEvent, getCalendar };
