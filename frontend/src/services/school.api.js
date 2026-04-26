import apiClient from "./apiClient";

/**
 * Récupère la liste de toutes les écoles (paginée + recherche).
 * @param {number} page - Numéro de page.
 * @param {number} limit - Éléments par page.
 * @param {string} search - Terme de recherche.
 * @returns {Promise<Object>} Liste paginée des écoles.
 */
export const getSchoolsRequest = async (page = 1, limit = 20, search = "") => (await apiClient.get(`/schools?page=${page}&limit=${limit}&search=${search}`)).data;

/**
 * Récupère les détails d'une école par son identifiant.
 * @param {string} id - L'identifiant de l'école.
 * @returns {Promise<Object>} Détails de l'école.
 */
export const getSchoolByIdRequest = async (id) => (await apiClient.get(`/schools/${id}`)).data;

/**
 * Crée une nouvelle école (demande d'inscription).
 * @param {Object} payload - Les données de l'école (nom, adresse, etc.).
 * @returns {Promise<Object>} L'école créée.
 */
export const createSchoolRequest = async (payload) => (await apiClient.post("/schools", payload)).data;

/**
 * Valide ou refuse une école.
 * @param {string} id - L'identifiant de l'école.
 * @param {string} status - Le nouveau statut (validated, rejected).
 * @returns {Promise<Object>} L'école mise à jour.
 */
export const validateSchoolRequest = async (id, status) => (await apiClient.patch(`/schools/${id}/validate`, { status })).data;

/**
 * Valide ou refuse toutes les écoles en attente.
 * @param {string} status - Le nouveau statut (approved, rejected).
 * @returns {Promise<Object>} Le résultat de la mise à jour.
 */
export const validateAllSchoolsRequest = async (status) => (await apiClient.patch(`/schools/validate-all`, { status })).data;
