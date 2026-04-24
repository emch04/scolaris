const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { registerTeacher, forgotPassword, resetPassword, loginUser } = require("./auth.service");

const register = asyncHandler(async (req, res) => {
  const teacher = await registerTeacher(req.body);
  return apiResponse(res, 201, "Enseignant enregistré.", { id: teacher._id, fullName: teacher.fullName, role: teacher.role });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  
  // Construction dynamique de l'objet user pour éviter les champs undefined
  const userData = {
    id: result.user._id,
    fullName: result.user.fullName,
    email: result.user.email || result.user.matricule,
    role: result.user.role,
    school: result.user.school
  };

  if (result.user.classroom) {
    userData.classroom = result.user.classroom;
  }

  if (result.user.matricule) {
    userData.matricule = result.user.matricule;
  }

  return apiResponse(res, 200, "Connexion réussie.", {
    token: result.token,
    user: userData
  });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { identifier } = req.body;
  await forgotPassword(identifier);
  return apiResponse(res, 200, "Si un compte existe pour cet identifiant, un code de réinitialisation a été envoyé.");
});

const executePasswordReset = asyncHandler(async (req, res) => {
  const { identifier, code, newPassword } = req.body;
  await resetPassword(identifier, code, newPassword);
  return apiResponse(res, 200, "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.");
});

module.exports = { register, login, requestPasswordReset, executePasswordReset };