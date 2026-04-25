/**
 * @fileoverview Utilitaire pour générer des matricules uniques pour les élèves.
 */

/**
 * Génère un matricule élève simple et lisible basé sur l'année actuelle et un nombre aléatoire.
 * Format : TEDP-[ANNÉE]-[RANDOM_6_DIGITS]
 * 
 * @function generateMatricule
 * @returns {string} Le matricule généré.
 */
const generateMatricule = () => {
  // On récupère l'année actuelle
  const year = new Date().getFullYear();

  // On crée un nombre aléatoire sur 6 chiffres
  const random = Math.floor(100000 + Math.random() * 900000);

  // On assemble le matricule final
  return `TEDP-${year}-${random}`;
};

// On exporte la fonction
module.exports = generateMatricule;
