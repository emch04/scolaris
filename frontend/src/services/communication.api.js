import apiClient from "./apiClient";

/**
 * Récupère les communications (annonces, infos).
 * 
 * @param {Object} params - Paramètres de filtrage.
 * @returns {Promise<Object>} La liste des communications.
 * @method GET
 * @url /communications
 */
export const getCommunicationsRequest = async (params) => {
  return (await apiClient.get("/communications", { params })).data;
};

/**
 * Crée une nouvelle communication.
 * 
 * @param {FormData} payload - Les données de la communication (peut inclure des images).
 * @returns {Promise<Object>} La communication créée.
 * @method POST
 * @url /communications
 */
export const createCommunicationRequest = async (payload) => {
  // Envoi multipart/form-data pour gérer les fichiers joints
  const config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return (await apiClient.post("/communications", payload, config)).data;
};
