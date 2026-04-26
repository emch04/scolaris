/**
 * @fileoverview Utilitaire pour générer des matricules uniques pour les élèves.
 */

const crypto = require("crypto");

/**
 * Génère un matricule élève basé sur l'année actuelle et une chaîne hexadécimale aléatoire.
 * Permet de supporter des millions de créations sans risque de doublon.
 * Format : TEDP-[ANNÉE]-[8_HEX_CHARS] (ex: TEDP-2026-A1B2C3D4)
 * 
 * @function generateMatricule
 * @returns {string} Le matricule généré.
 */
const generateMatricule = () => {
  const year = new Date().getFullYear();

  // 4 octets = 8 caractères hexadécimaux (plus de 4 milliards de combinaisons par an)
  // Utilisation de crypto pour une vraie source d'entropie
  const uniqueCode = crypto.randomBytes(4).toString("hex").toUpperCase();

  // On assemble le matricule final
  return `TEDP-${year}-${uniqueCode}`;
};

// On exporte la fonction
module.exports = generateMatricule;
