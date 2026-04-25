import apiClient from "./apiClient";

/**
 * Récupère la liste des devoirs.
 * 
 * @param {Object} params - Les paramètres de filtrage (ex: classroomId).
 * @returns {Promise<Object>} La réponse de l'API contenant les devoirs.
 * @method GET
 * @url /assignments
 */
export const getAssignmentsRequest = async (params) => (await apiClient.get("/assignments", { params })).data;

/**
 * Crée un nouveau devoir.
 * 
 * @param {FormData} payload - Les données du devoir (inclut potentiellement des fichiers).
 * @returns {Promise<Object>} La réponse de l'API contenant le devoir créé.
 * @method POST
 * @url /assignments
 */
export const createAssignmentRequest = async (payload) => {
  // Configuration pour l'envoi de fichiers via FormData
  const config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return (await apiClient.post("/assignments", payload, config)).data;
};
