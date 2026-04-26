import apiClient from "./apiClient";

/**
 * Récupère les données du tableau de bord pour un parent.
 * 
 * @returns {Promise<Object>} Statistiques et informations pour le parent.
 * @method GET
 * @url /parents/dashboard
 */
export const getParentDashboardRequest = async () => (await apiClient.get("/parents/dashboard")).data;

/**
 * Récupère la liste de tous les parents (pour administration).
 * 
 * @param {number} page - Numéro de page.
 * @param {number} limit - Éléments par page.
 * @returns {Promise<Object>} La liste paginée des parents.
 * @method GET
 * @url /parents
 */
export const getParentsRequest = async (page = 1, limit = 20) => (await apiClient.get(`/parents?page=${page}&limit=${limit}`)).data;

/**
 * Met à jour les informations d'un parent.
 * 
 * @param {string} id - L'identifiant du parent.
 * @param {Object} payload - Les nouvelles données du parent.
 * @returns {Promise<Object>} Le parent mis à jour.
 * @method PUT
 * @url /parents/:id
 */
export const updateParentRequest = async (id, payload) => (await apiClient.put(`/parents/${id}`, payload)).data;
