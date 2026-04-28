/**
 * @file timetable.controller.js
 * @description Contrôleur pour la gestion des horaires de cours.
 */
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { 
  createTimetableEntry, 
  getTimetableByClassroom, 
  updateTimetableEntryById, 
  deleteTimetableEntryById 
} = require("./timetable.service");

// Ajouter une entrée à l'emploi du temps
const addTimetableEntry = asyncHandler(async (req, res) => {
  const entry = await createTimetableEntry(req.body);
  return apiResponse(res, 201, "Cours ajouté à l'emploi du temps.", entry);
});

// Récupérer l'emploi du temps d'une classe
const getClassroomTimetable = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const timetable = await getTimetableByClassroom(classroomId);
  return apiResponse(res, 200, "Emploi du temps récupéré.", timetable);
});

// Mettre à jour une entrée
const updateTimetableEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const entry = await updateTimetableEntryById(id, req.body);
  if (!entry) {
    return apiResponse(res, 404, "Entrée non trouvée.");
  }
  return apiResponse(res, 200, "Cours mis à jour.", entry);
});

// Supprimer une entrée
const deleteTimetableEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteTimetableEntryById(id);
  return apiResponse(res, 200, "Cours supprimé.");
});

module.exports = {
  addTimetableEntry,
  getClassroomTimetable,
  updateTimetableEntry,
  deleteTimetableEntry
};
