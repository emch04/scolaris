// Import du modèle Student
const Student = require("./student.model");
const Assignment = require("../assignments/assignment.model");
const Result = require("../results/result.model");
const Communication = require("../communications/communication.model");
const generateMatricule = require("../../utils/generateMatricule");

// Créer un élève
const createStudent = async (payload) => {
  let student;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      // On génère un matricule
      const matricule = generateMatricule();
      // On crée l'élève
      student = await Student.create({
        ...payload,
        matricule
      });
      break; // Succès, on quitte la boucle
    } catch (error) {
      // 11000 = Code MongoDB pour doublon d'index unique
      if (error.code === 11000 && error.keyPattern && error.keyPattern.matricule) {
        attempts++;
        console.warn(`⚠️ [Anti-Collision] Matricule en double détecté ! Génération d'un nouveau matricule (Tentative ${attempts}/${maxAttempts})...`);
        if (attempts >= maxAttempts) {
          throw new Error("Impossible de générer un matricule unique après plusieurs tentatives.");
        }
      } else {
        // Autre erreur, on la propage
        throw error;
      }
    }
  }
  
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

/**
 * Récupère la liste des élèves selon les critères de filtrage et pagination.
 */
const getAllStudents = async (filter = {}, skip = 0, limit = 20) => {
  // On retourne la liste avec les relations utiles
  return await Student.find(filter)
    .populate("school", "name code")
    .populate("classroom", "name level")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

/**
 * Compte le nombre total d'élèves selon un filtre.
 */
const countStudents = async (filter = {}) => {
  return await Student.countDocuments(filter);
};

// Export
module.exports = {
  createStudent,
  getAllStudents,
  getStudentDashboardData,
  countStudents
};
