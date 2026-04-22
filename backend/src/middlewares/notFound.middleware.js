// Middleware appelé lorsqu'aucune route n'est trouvée
const notFoundMiddleware = (req, res, next) => {
  // On renvoie une réponse 404
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.originalUrl}`
  });
};
// Export
module.exports = notFoundMiddleware;
