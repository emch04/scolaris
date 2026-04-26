import apiClient from "./apiClient";

/**
 * Récupère les statistiques globales du réseau (Hero / Super Admin).
 * @param {string} schoolId - Identifiant d'une école pour filtrer (Hero Admin uniquement).
 * @param {string} period - Période (daily, weekly, monthly).
 */
export const getGlobalStatsRequest = async (schoolId = "", period = "monthly") => {
  let url = `/stats/global?period=${period}`;
  if (schoolId) url += `&schoolId=${schoolId}`;
  return (await apiClient.get(url)).data;
};

/**
 * Récupère les statistiques d'une école (Directeur / Admin / Enseignant).
 * @param {string} period - Période (daily, weekly, monthly).
 */
export const getTeacherStatsRequest = async (period = "monthly") => (await apiClient.get(`/stats/teacher?period=${period}`)).data;
