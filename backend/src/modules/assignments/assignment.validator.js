const { body } = require("express-validator");

const createAssignmentValidator = [
  body("title")
    .notEmpty()
    .withMessage("Le titre du devoir est obligatoire."),

  body("description")
    .notEmpty()
    .withMessage("La description du devoir est obligatoire."),

  body("classroom")
    .notEmpty()
    .withMessage("L'identifiant de la classe est obligatoire."),

  body("teacher")
    .notEmpty()
    .withMessage("L'identifiant de l'enseignant est obligatoire.")
];

module.exports = {
  createAssignmentValidator
};