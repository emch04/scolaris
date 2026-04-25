import apiClient from "./apiClient";

/**
 * Récupère les événements du calendrier.
 * 
 * @returns {Promise<Object>} La liste des événements.
 * @method GET
 * @url /calendar
 */
export const getCalendarRequest = async () => (await apiClient.get("/calendar")).data;

/**
 * Ajoute un nouvel événement au calendrier.
 * 
 * @param {Object} data - Les données de l'événement (titre, date, description).
 * @returns {Promise<Object>} La réponse de l'API.
 * @method POST
 * @url /calendar
 */
export const addEventRequest = async (data) => (await apiClient.post("/calendar", data)).data;
