const Timetable = require("./timetable.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

// Ajouter une entrée à l'emploi du temps
const addTimetableEntry = asyncHandler(async (req, res) => {
  const entry = await Timetable.create(req.body);
  return apiResponse(res, 201, "Cours ajouté à l'emploi du temps.", entry);
});

// Récupérer l'emploi du temps d'une classe
const getClassroomTimetable = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const timetable = await Timetable.find({ classroom: classroomId })
    .sort({ startTime: 1 })
    .populate("teacher", "fullName");

  return apiResponse(res, 200, "Emploi du temps récupéré.", timetable);
});

// Supprimer une entrée
const deleteTimetableEntry = asyncHandler(async (req, res) => {
  await Timetable.findByIdAndDelete(req.params.id);
  return apiResponse(res, 200, "Cours supprimé.");
});

module.exports = {
  addTimetableEntry,
  getClassroomTimetable,
  deleteTimetableEntry
};
