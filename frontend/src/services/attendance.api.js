import apiClient from "./apiClient";

/**
 * Enregistre la présence pour un ou plusieurs étudiants.
 * 
 * @param {Object} data - Les données de présence (étudiant, classe, statut).
 * @returns {Promise<Object>} La réponse de l'API.
 * @method POST
 * @url /attendance
 */
export const markAttendanceRequest = async (data) => (await apiClient.post("/attendance", data)).data;

/**
 * Récupère les présences d'un étudiant spécifique.
 * 
 * @param {string} studentId - L'identifiant de l'étudiant.
 * @returns {Promise<Object>} La liste des présences de l'étudiant.
 * @method GET
 * @url /attendance/student/:studentId
 */
export const getStudentAttendanceRequest = async (studentId) => (await apiClient.get(`/attendance/student/${studentId}`)).data;

/**
 * Récupère les présences d'une classe pour une date donnée.
 * 
 * @param {string} classroomId - L'identifiant de la classe.
 * @param {string} date - La date concernée (format YYYY-MM-DD).
 * @returns {Promise<Object>} La liste des présences de la classe.
 * @method GET
 * @url /attendance/classroom/:classroomId?date=:date
 */
export const getClassroomAttendanceRequest = async (classroomId, date) => (await apiClient.get(`/attendance/classroom/${classroomId}?date=${date}`)).data;
