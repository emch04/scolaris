/**
 * @module Auth/Controller
 * @description Contrôleurs gérant les requêtes HTTP d'authentification.
 */

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

/**
 * Gère l'inscription des différents types d'utilisateurs.
 * @route POST /api/auth/register
 * @param {Object} req - Requête Express.
 * @param {Object} req.body - Données d'inscription incluant le champ 'type'.
 * @param {Object} res - Réponse Express.
 */
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

/**
 * Connecte un utilisateur et définit les cookies JWT.
 * @route POST /api/auth/login
 * @param {Object} req - Requête Express.
 * @param {Object} res - Réponse Express.
 */
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

  // Auto-résolution intelligente
  const { autoResolveLogs } = require("../logs/log.controller");
  const resolvedCount = await autoResolveLogs({ userId: result.user._id });

  return apiResponse(res, 200, "Connexion réussie.", {
    user: userData,
    token: result.token,
    refreshToken: result.refreshToken,
    resolvedCount
  });
});

/**
 * Déconnecte l'utilisateur en supprimant les cookies et le refresh token en base.
 * @route POST /api/auth/logout
 */
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

/**
 * Renouvelle l'Access Token en utilisant le Refresh Token.
 * @route POST /api/auth/refresh
 */
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

  return apiResponse(res, 200, "Session renouvelée.", { token: newToken });
});

/**
 * Retourne les informations de l'utilisateur connecté (vérification de session).
 * @route GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  // Auto-résolution intelligente : Si l'utilisateur arrive ici, c'est que son système est stable
  const { autoResolveLogs } = require("../logs/log.controller");
  const resolvedCount = await autoResolveLogs({ 
    userId: req.user.id 
  });

  return apiResponse(res, 200, "Session active.", { 
    user: req.user,
    resolvedCount
  });
});

/**
 * Demande une réinitialisation de mot de passe (envoi d'OTP).
 * @route POST /api/auth/forgot-password
 */
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { identifier } = req.body;
  await forgotPassword(identifier);
  return apiResponse(res, 200, "Si un compte existe pour cet identifiant, un code de réinitialisation a été envoyé.");
});

/**
 * Exécute la réinitialisation du mot de passe avec l'OTP.
 * @route POST /api/auth/reset-password
 */
const executePasswordReset = asyncHandler(async (req, res) => {
  const { identifier, code, newPassword } = req.body;
  await resetPassword(identifier, code, newPassword);
  return apiResponse(res, 200, "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.");
});

module.exports = { register, login, logout, refresh, getMe, requestPasswordReset, executePasswordReset };