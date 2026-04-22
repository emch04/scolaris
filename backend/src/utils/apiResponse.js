// Fonction utilitaire pour standardiser les réponses API réussies
const apiResponse = (res, statusCode, message, data = null) => {
  // On envoie toujours une structure cohérente
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Export
module.exports = apiResponse;