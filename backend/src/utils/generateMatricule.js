// Fonction pour générer un matricule élève simple et lisible
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