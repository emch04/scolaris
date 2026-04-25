import apiClient from "./apiClient";

/**
 * Connecte un utilisateur.
 * 
 * @param {Object} payload - Les identifiants (email, password).
 * @returns {Promise<Object>} Les données de l'utilisateur et le token.
 * @method POST
 * @url /auth/login
 */
export const loginRequest = async (payload) => (await apiClient.post("/auth/login", payload)).data;

/**
 * Déconnecte l'utilisateur actuel.
 * 
 * @returns {Promise<Object>} La réponse de l'API.
 * @method POST
 * @url /auth/logout
 */
export const logoutRequest = async () => (await apiClient.post("/auth/logout")).data;

/**
 * Récupère les informations de l'utilisateur connecté.
 * 
 * @returns {Promise<Object>} Les données de l'utilisateur.
 * @method GET
 * @url /auth/me
 */
export const getMeRequest = async () => (await apiClient.get("/auth/me")).data;

/**
 * Enregistre un nouvel utilisateur (généralement une école).
 * 
 * @param {Object} payload - Les données d'inscription.
 * @returns {Promise<Object>} La réponse de l'API.
 * @method POST
 * @url /auth/register
 */
export const registerRequest = async (payload) => (await apiClient.post("/auth/register", payload)).data;

/**
 * Envoie une demande de réinitialisation de mot de passe.
 * 
 * @param {string} identifier - L'email ou le matricule de l'utilisateur.
 * @returns {Promise<Object>} La réponse de l'API.
 * @method POST
 * @url /auth/forgot-password
 */
export const forgotPasswordRequest = async (identifier) => (await apiClient.post("/auth/forgot-password", { identifier })).data;

/**
 * Réinitialise le mot de passe avec un nouveau mot de passe.
 * 
 * @param {Object} payload - Contient le token et le nouveau mot de passe.
 * @returns {Promise<Object>} La réponse de l'API.
 * @method POST
 * @url /auth/reset-password
 */
export const resetPasswordRequest = async (payload) => (await apiClient.post("/auth/reset-password", payload)).data;
