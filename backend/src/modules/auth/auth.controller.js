const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { 
  registerTeacher, 
  registerTeacherPublic,
  registerStudentPublic,
  registerParentPublic,
  forgotPassword, 
  resetPassword, 
  loginUser 
} = require("./auth.service");

const register = asyncHandler(async (req, res) => {
  const { type } = req.body; // "teacher", "student", "parent"
  let user;

  if (type === "student") {
    user = await registerStudentPublic(req.body);
  } else if (type === "parent") {
    user = await registerParentPublic(req.body);
  } else if (type === "teacher_public") {
    user = await registerTeacherPublic(req.body);
  } else {
    // Inscription admin (privée)
    user = await registerTeacher(req.body);
  }

  return apiResponse(res, 201, "Inscription réussie.", { id: user._id, fullName: user.fullName, role: user.role, matricule: user.matricule });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  
  const userData = {
    id: result.user._id,
    fullName: result.user.fullName,
    email: result.user.email || result.user.matricule,
    role: result.user.role,
    school: result.user.school
  };

  if (result.user.classroom) userData.classroom = result.user.classroom;
  if (result.user.matricule) userData.matricule = result.user.matricule;

  // Options du cookie
  const isProduction = process.env.NODE_ENV === "production";
  const commonOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax"
  };

  // On envoie les tokens dans les cookies
  res.cookie("token", result.token, { ...commonOptions, maxAge: 15 * 60 * 1000 }); // 15 min
  res.cookie("refreshToken", result.refreshToken, { ...commonOptions, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 jours

  return apiResponse(res, 200, "Connexion réussie.", {
    user: userData
  });
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    const Token = require("./token.model");
    await Token.deleteOne({ refreshToken });
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
  });
  return apiResponse(res, 200, "Déconnexion réussie.");
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new Error("Refresh Token manquant.");

  const Token = require("./token.model");
  const storedToken = await Token.findOne({ refreshToken }).populate("userId");
  
  if (!storedToken) throw new Error("Session invalide.");

  const user = storedToken.userId;
  const payload = { 
    id: user._id, 
    email: user.email || user.matricule, 
    role: user.role, 
    school: user.school 
  };
  if (user.classroom) payload.classroom = user.classroom;

  const jwt = require("jsonwebtoken");
  const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

  res.cookie("token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 15 * 60 * 1000
  });

  return apiResponse(res, 200, "Session renouvelée.");
});

const getMe = asyncHandler(async (req, res) => {
  // Cette fonction sera appelée au chargement du frontend pour vérifier si le cookie est valide
  // Le middleware authMiddleware aura déjà mis user dans req.user
  return apiResponse(res, 200, "Session active.", { user: req.user });
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

module.exports = { register, login, logout, refresh, getMe, requestPasswordReset, executePasswordReset };