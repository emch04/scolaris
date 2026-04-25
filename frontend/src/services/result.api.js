import apiClient from "./apiClient";

/**
 * Récupère le bulletin de notes d'un étudiant.
 * 
 * @param {string} studentId - L'identifiant de l'étudiant.
 * @returns {Promise<Object>} Les notes et résultats de l'étudiant.
 * @method GET
 * @url /results/student/:studentId
 */
export const getStudentBulletinRequest = async (studentId) => {
  return (await apiClient.get(`/results/student/${studentId}`)).data;
};

/**
 * Enregistre un nouveau résultat (note) pour un étudiant.
 * 
 * @param {Object} payload - Les données du résultat (étudiant, matière, note).
 * @returns {Promise<Object>} Le résultat enregistré.
 * @method POST
 * @url /results
 */
export const addStudentResultRequest = async (payload) => {
  return (await apiClient.post("/results", payload)).data;
};
