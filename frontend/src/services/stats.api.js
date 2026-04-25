import apiClient from "./apiClient";

/**
 * Récupère les statistiques globales du système (administrateur).
 * @returns {Promise<Object>} Statistiques globales.
 */
export const getGlobalStatsRequest = async () => (await apiClient.get("/stats/global")).data;

/**
 * Récupère les statistiques spécifiques à un enseignant.
 * @returns {Promise<Object>} Statistiques de l'enseignant.
 */
export const getTeacherStatsRequest = async () => (await apiClient.get("/stats/teacher")).data;
