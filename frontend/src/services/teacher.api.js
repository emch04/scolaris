import apiClient from "./apiClient";

/**
 * Récupère la liste des enseignants de l'école.
 * @returns {Promise<Array>} Liste des enseignants.
 */
export const getTeachersRequest = async () => (await apiClient.get("/teachers")).data;

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
