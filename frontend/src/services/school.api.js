import apiClient from "./apiClient";

/**
 * Récupère la liste de toutes les écoles.
 * @returns {Promise<Array>} Liste des écoles.
 */
export const getSchoolsRequest = async () => (await apiClient.get("/schools")).data;

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
