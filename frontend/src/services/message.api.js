import apiClient from "./apiClient";

/**
 * Envoie un nouveau message.
 * 
 * @param {Object} data - Le contenu du message et le destinataire.
 * @returns {Promise<Object>} Le message envoyé.
 * @method POST
 * @url /messages
 */
export const sendMessageRequest = async (data) => (await apiClient.post("/messages", data)).data;

/**
 * Récupère les messages personnels de l'utilisateur.
 * 
 * @returns {Promise<Object>} La liste des messages reçus/envoyés.
 * @method GET
 * @url /messages/my
 */
export const getMyMessagesRequest = async () => (await apiClient.get("/messages/my")).data;

/**
 * Récupère les messages partagés au sein d'une classe.
 * 
 * @param {string} classId - L'identifiant de la classe.
 * @returns {Promise<Object>} La liste des messages de la classe.
 * @method GET
 * @url /messages/classroom/:classId
 */
export const getClassroomMessagesRequest = async (classId) => (await apiClient.get(`/messages/classroom/${classId}`)).data;

/**
 * Marque un message comme lu.
 * 
 * @param {string} id - L'identifiant du message.
 * @returns {Promise<Object>} La réponse de l'API.
 * @method PATCH
 * @url /messages/read/:id
 */
export const markMessageAsReadRequest = async (id) => (await apiClient.patch(`/messages/read/${id}`)).data;
