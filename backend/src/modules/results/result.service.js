/**
 * @file result.service.js
 * @description Service gérant la saisie des notes et le calcul des moyennes.
 */
const Result = require("./result.model");

/**
 * Enregistre une nouvelle note pour un élève.
 */
const addResult = async (payload) => {
  return await Result.create(payload);
};

/**
 * Récupère tous les résultats scolaires d'un étudiant.
 */
const getStudentResults = async (studentId) => {
  return await Result.find({ student: studentId })
    .populate({
      path: "student",
      populate: { path: "classroom school" }
    })
    .populate("teacher", "fullName")
    .sort({ period: 1, subject: 1 });
};

module.exports = { addResult, getStudentResults };
