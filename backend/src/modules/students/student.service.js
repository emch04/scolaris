// Import du modèle Student
const Student = require("./student.model");
const Assignment = require("../assignments/assignment.model");
const Result = require("../results/result.model");
const Communication = require("../communications/communication.model");
const generateMatricule = require("../../utils/generateMatricule");

// Créer un élève
const createStudent = async (payload) => {
  // On génère un matricule
  const matricule = generateMatricule();
  // On crée l'élève
  const student = await Student.create({
    ...payload,
    matricule
  });
  // On retourne l'élève créé
  return student;
};

const getStudentDashboardData = async (studentId) => {
  const student = await Student.findById(studentId)
    .populate("school", "name description principalName phone email")
    .populate("classroom", "name level");
  
  if (!student) return null;

  // Récupérer les devoirs de sa classe
  const assignments = await Assignment.find({ classroom: student.classroom._id })
    .populate("teacher", "fullName")
    .sort({ createdAt: -1 });

  // Récupérer ses résultats
  const results = await Result.find({ student: studentId })
    .sort({ createdAt: -1 });

  // Récupérer les communications (école entière ou sa classe)
  const communications = await Communication.find({
    $or: [
      { school: student.school._id, classroom: { $exists: false } },
      { school: student.school._id, classroom: null },
      { classroom: student.classroom._id }
    ]
  })
    .populate("author", "fullName")
    .sort({ createdAt: -1 })
    .limit(5);

  return { student, assignments, results, communications };
};

// Récupérer tous les élèves
const getAllStudents = async (filter = {}) => {
  // On retourne la liste avec les relations utiles
  return await Student.find(filter)
    .populate("school", "name code")
    .populate("classroom", "name level")
    .sort({ createdAt: -1 });
};
// Export
module.exports = {
  createStudent,
  getAllStudents,
  getStudentDashboardData
};
