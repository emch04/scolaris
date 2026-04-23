// On importe body depuis express-validator
const { body } = require("express-validator");
// Règles de validation pour l'inscription
const registerValidator = [
  // Le nom complet est obligatoire
  body("fullName")
    .notEmpty()
    .withMessage("Le nom complet est obligatoire."),
  // L'email doit être valide
  body("email")
    .isEmail()
    .withMessage("Veuillez fournir un email valide."),
  // Le mot de passe doit contenir au moins 6 caractères
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères.")
];
// Règles de validation pour la connexion
const loginValidator = [
  // Vérification email ou matricule (on vérifie juste que ce n'est pas vide)
  body("email")
    .notEmpty()
    .withMessage("L'email ou le matricule est obligatoire."),
  // Vérification mot de passe
  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire.")
];
// Export des validateurs
module.exports = {
  registerValidator,
  loginValidator
};
