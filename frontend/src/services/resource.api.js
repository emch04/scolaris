import apiClient from "./apiClient";

/**
 * Récupère les ressources documentaires (bibliothèque).
 * 
 * @param {Object} params - Filtres (matière, classe, etc.).
 * @returns {Promise<Object>} La liste des ressources.
 * @method GET
 * @url /resources
 */
export const getResourcesRequest = async (params) => (await apiClient.get("/resources", { params })).data;

/**
 * Ajoute une nouvelle ressource (document, lien).
 * 
 * @param {FormData} data - Les données de la ressource.
 * @returns {Promise<Object>} La ressource ajoutée.
 * @method POST
 * @url /resources
 */
export const addResourceRequest = async (data) => {
  // Envoi de fichiers via multipart/form-data
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  return (await apiClient.post("/resources", data, config)).data;
};

/**
 * Supprime une ressource.
 * 
 * @param {string} id - L'identifiant de la ressource.
 * @returns {Promise<Object>} La réponse de l'API.
 * @method DELETE
 * @url /resources/:id
 */
export const deleteResourceRequest = async (id) => (await apiClient.delete(`/resources/${id}`)).data;
