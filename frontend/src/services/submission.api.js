import apiClient from "./apiClient";

/**
 * Soumet un devoir ou une signature de devoir.
 * @param {Object} payload - Données de la soumission (fileUrl, assignmentId, etc.).
 * @returns {Promise<Object>} Résultat de la soumission.
 */
export const submitAssignmentSignatureRequest = async (payload) => {
  return (await apiClient.post("/submissions", payload)).data;
};

/**
 * Récupère toutes les soumissions pour un devoir spécifique.
 * @param {string} assignmentId - L'identifiant du devoir.
 * @returns {Promise<Array>} Liste des soumissions.
 */
export const getAssignmentSubmissionsRequest = async (assignmentId) => {
  return (await apiClient.get(`/submissions/assignment/${assignmentId}`)).data;
};
