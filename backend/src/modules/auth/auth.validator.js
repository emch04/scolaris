/**
 * @module Auth/Validators
 * @description Validateurs pour les requêtes d'authentification utilisant express-validator.
 */

const { body } = require("express-validator");

/**
 * Règles de validation pour l'inscription.
 * Vérifie le nom complet, l'email et la longueur du mot de passe.
 * @type {Array<import('express-validator').ValidationChain>}
 */
const registerValidator = [
  body("fullName")
    .notEmpty()
    .withMessage("Le nom complet est obligatoire."),
  body("email")
    .isEmail()
    .withMessage("Veuillez fournir un email valide."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères.")
];

/**
 * Règles de validation pour la connexion.
 * Vérifie la présence de l'identifiant (email/matricule) et du mot de passe.
 * @type {Array<import('express-validator').ValidationChain>}
 */
const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("L'email ou le matricule est obligatoire."),
  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire.")
];

module.exports = {
  registerValidator,
  loginValidator
};
