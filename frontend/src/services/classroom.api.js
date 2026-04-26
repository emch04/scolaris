import apiClient from "./apiClient";

/**
 * Récupère la liste de toutes les classes (paginée + recherche).
 * 
 * @param {number} page - Numéro de page.
 * @param {number} limit - Éléments par page.
 * @param {string} search - Terme de recherche.
 * @returns {Promise<Object>} La liste des classes.
 * @method GET
 * @url /classrooms
 */
export const getClassroomsRequest = async (page = 1, limit = 20, search = "") => (await apiClient.get(`/classrooms?page=${page}&limit=${limit}&search=${search}`)).data;

/**
 * Crée une nouvelle classe.
 * 
 * @param {Object} classroomData - Les données de la classe à créer.
 * @returns {Promise<Object>} La classe créée.
 * @method POST
 * @url /classrooms
 */
export const createClassroomRequest = async (classroomData) => (await apiClient.post("/classrooms", classroomData)).data;

/**
 * Récupère les détails d'une classe spécifique.
 * 
 * @param {string} id - L'identifiant de la classe.
 * @returns {Promise<Object>} Les détails de la classe.
 * @method GET
 * @url /classrooms/:id
 */
export const getClassroomByIdRequest = async (id) => (await apiClient.get(`/classrooms/${id}`)).data;
