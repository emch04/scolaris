/**
 * @file student.validator.js
 * @description Validateurs pour les données des élèves.
 */
// Import de body
const { body } = require("express-validator");
// Validation création élève
const createStudentValidator = [
  // Nom complet obligatoire
  body("fullName")
    .notEmpty()
    .withMessage("Le nom complet de l'élève est obligatoire."),
  // L'école est obligatoire
  body("school")
    .notEmpty()
    .withMessage("L'identifiant de l'école est obligatoire."),
  // La classe est obligatoire
  body("classroom")
    .notEmpty()
    .withMessage("L'identifiant de la classe est obligatoire.")
];
// Export
module.exports = {
  createStudentValidator
};
