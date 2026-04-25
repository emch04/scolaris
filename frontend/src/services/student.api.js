import apiClient from "./apiClient";

/**
 * Récupère la liste des élèves de l'école (pour le directeur).
 * @returns {Promise<Array>} Liste des élèves.
 */
export const getStudentsRequest = async () => (await apiClient.get("/students")).data;

/**
 * Récupère les données du tableau de bord d'un élève.
 * @returns {Promise<Object>} Données du tableau de bord.
 */
export const getStudentDashboardRequest = async () => (await apiClient.get("/students/dashboard")).data;

/**
 * Crée un nouvel élève.
 * @param {Object} payload - Données de l'élève.
 * @returns {Promise<Object>} L'élève créé.
 */
export const createStudentRequest = async (payload) => (await apiClient.post("/students", payload)).data;
