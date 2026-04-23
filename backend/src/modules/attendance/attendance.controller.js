const Attendance = require("./attendance.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

// Enregistrer une liste de présences
const markAttendance = asyncHandler(async (req, res) => {
  const { classroom, date, attendanceList } = req.body; // attendanceList: [{ student, status, reason }]

  if (!attendanceList || !Array.isArray(attendanceList)) {
    return res.status(400).json({ success: false, message: "Liste de présence invalide." });
  }

  const attendanceRecords = attendanceList.map(item => ({
    student: item.student,
    classroom,
    teacher: req.user.id,
    date: date || new Date(),
    status: item.status,
    reason: item.reason || ""
  }));

  // On nettoie les anciennes entrées pour cette date et cette classe pour éviter les doublons
  const startOfDay = new Date(date || new Date());
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date || new Date());
  endOfDay.setHours(23, 59, 59, 999);

  await Attendance.deleteMany({
    classroom,
    date: { $gte: startOfDay, $lte: endOfDay }
  });

  const savedAttendance = await Attendance.insertMany(attendanceRecords);

  return apiResponse(res, 201, "Présences enregistrées avec succès.", savedAttendance);
});

// Récupérer les absences d'un élève (pour le parent/élève)
const getStudentAttendance = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const attendance = await Attendance.find({ student: studentId })
    .sort({ date: -1 })
    .populate("teacher", "fullName");

  return apiResponse(res, 200, "Historique récupéré.", attendance);
});

// Récupérer les présences d'une classe pour une date donnée
const getClassroomAttendance = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const { date } = req.query;

  const startOfDay = new Date(date || new Date());
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date || new Date());
  endOfDay.setHours(23, 59, 59, 999);

  const attendance = await Attendance.find({
    classroom: classroomId,
    date: { $gte: startOfDay, $lte: endOfDay }
  }).populate("student", "fullName matricule");

  return apiResponse(res, 200, "Présences de la classe récupérées.", attendance);
});

module.exports = {
  markAttendance,
  getStudentAttendance,
  getClassroomAttendance
};
