const Timetable = require("./timetable.model");

const createTimetableEntry = async (data) => {
  return await Timetable.create(data);
};

const getTimetableByClassroom = async (classroomId) => {
  return await Timetable.find({ classroom: classroomId })
    .sort({ startTime: 1 })
    .populate("teacher", "fullName");
};

const updateTimetableEntryById = async (id, data) => {
  return await Timetable.findByIdAndUpdate(id, data, { new: true });
};

const deleteTimetableEntryById = async (id) => {
  return await Timetable.findByIdAndDelete(id);
};

module.exports = {
  createTimetableEntry,
  getTimetableByClassroom,
  updateTimetableEntryById,
  deleteTimetableEntryById
};
