import apiClient from "./apiClient";

/**
 * Récupère la liste des enseignants de l'école.
 * @param {number} page - Numéro de page.
 * @param {number} limit - Éléments par page.
 * @param {string} search - Terme de recherche.
 * @returns {Promise<Object>} Liste paginée des enseignants.
 */
export const getTeachersRequest = async (page = 1, limit = 20, search = "") => (await apiClient.get(`/teachers?page=${page}&limit=${limit}&search=${search}`)).data;

/**
 * Crée un nouvel enseignant.
 * @param {Object} data - Données de l'enseignant (nom, email, spécialité).
 * @returns {Promise<Object>} L'enseignant créé.
 */
export const createTeacherRequest = async (data) => (await apiClient.post("/teachers", data)).data;

/**
 * Supprime un enseignant.
 * @param {string} id - L'identifiant de l'enseignant à supprimer.
 * @returns {Promise<Object>} Résultat de la suppression.
 */
export const deleteTeacherRequest = async (id) => (await apiClient.delete(`/teachers/${id}`)).data;
