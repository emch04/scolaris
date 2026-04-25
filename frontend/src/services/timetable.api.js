import apiClient from "./apiClient";

/**
 * Ajoute une entrée dans l'emploi du temps.
 * @param {Object} data - Données de l'entrée (day, startTime, endTime, subject, classroomId).
 * @returns {Promise<Object>} L'entrée créée.
 */
export const addTimetableEntryRequest = async (data) => (await apiClient.post("/timetable", data)).data;

/**
 * Récupère l'emploi du temps complet pour une classe donnée.
 * @param {string} classroomId - L'identifiant de la classe.
 * @returns {Promise<Array>} Emploi du temps de la classe.
 */
export const getClassroomTimetableRequest = async (classroomId) => (await apiClient.get(`/timetable/classroom/${classroomId}`)).data;

/**
 * Supprime une entrée de l'emploi du temps.
 * @param {string} id - L'identifiant de l'entrée à supprimer.
 * @returns {Promise<Object>} Résultat de la suppression.
 */
export const deleteTimetableEntryRequest = async (id) => (await apiClient.delete(`/timetable/${id}`)).data;
