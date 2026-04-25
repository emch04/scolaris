import apiClient from "./apiClient";

/**
 * Récupère le plan de cours d'une classe spécifique.
 * 
 * @param {string} classId - L'identifiant de la classe.
 * @returns {Promise<Object>} Le plan de cours.
 * @method GET
 * @url /course-plans/classroom/:classId
 */
export const getCoursePlansRequest = async (classId) => (await apiClient.get(`/course-plans/classroom/${classId}`)).data;

/**
 * Ajoute un nouvel élément au plan de cours.
 * 
 * @param {Object} data - Les données du plan (sujet, date prévue, etc.).
 * @returns {Promise<Object>} L'élément créé.
 * @method POST
 * @url /course-plans
 */
export const addCoursePlanRequest = async (data) => (await apiClient.post("/course-plans", data)).data;
