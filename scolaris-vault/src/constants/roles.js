/**
 * @file roles.js
 * @description Définition des rôles utilisateurs pour le système Scolaris.
 */

const ROLES = {
  HERO_ADMIN: "hero_admin",
  SUPER_ADMIN: "super_admin",
  DIRECTOR: "director",
  ADMIN: "admin",
  SECRETARY: "secretary",    // Nouveau rôle : Gestion administrative et financière
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent"
};

module.exports = ROLES;
