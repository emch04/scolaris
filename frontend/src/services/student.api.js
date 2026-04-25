import apiClient from "./apiClient";

/**
 * Récupère la liste des élèves de l'école (paginée).
 * @param {number} page - Numéro de la page.
 * @param {number} limit - Nombre d'éléments par page.
 */
export const getStudentsRequest = async (page = 1, limit = 20) => (await apiClient.get(`/students?page=${page}&limit=${limit}`)).data;

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
