/**
 * @file roles.js
 * @description Définition des constantes de rôles utilisateurs pour l'ensemble du système Scolaris.
 * Ces rôles sont utilisés pour la gestion des permissions et le contrôle d'accès (RBAC).
 */

/**
 * Liste des rôles disponibles dans l'application.
 * @constant {Object}
 */
const ROLES = {
  SUPER_ADMIN: "super_admin", // Administrateur système global
  ADMIN: "admin",             // Administrateur d'école
  DIRECTOR: "director",       // Préfet ou Directeur des études
  TEACHER: "teacher",         // Enseignant
  PARENT: "parent",           // Parent d'élève
  STUDENT: "student"          // Élève
};

module.exports = ROLES;