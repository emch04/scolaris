// Import du helper asyncHandler
const asyncHandler = require("../../utils/asyncHandler");
// Import du helper de réponse API
const apiResponse = require("../../utils/apiResponse");
// Import des services d'authentification
const { registerTeacher, loginTeacher } = require("./auth.service");
// Contrôleur d'inscription
const register = asyncHandler(async (req, res) => {
  // On enregistre le nouvel enseignant
  const teacher = await registerTeacher(req.body);
  // Réponse de succès
  return apiResponse(res, 201, "Enseignant enregistré avec succès.", {
    id: teacher._id,
    fullName: teacher.fullName,
    email: teacher.email,
    role: teacher.role
  });
});
// Contrôleur de connexion
const login = asyncHandler(async (req, res) => {
  // On récupère email et password depuis le body
  const { email, password } = req.body;
  // On tente la connexion
  const result = await loginTeacher(email, password);
  // Réponse de succès avec token
  return apiResponse(res, 200, "Connexion réussie.", {
    token: result.token,
    teacher: {
      id: result.teacher._id,
      fullName: result.teacher.fullName,
      email: result.teacher.email,
      role: result.teacher.role
    }
  });
});
// Export des contrôleurs
module.exports = {
  register,
  login
};
