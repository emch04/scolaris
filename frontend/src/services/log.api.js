import apiClient from "./apiClient";

/**
 * Récupère les derniers rapports d'incidents (Super Admin).
 */
export const getLogsRequest = async () => (await apiClient.get("/logs")).data;

/**
 * Vide tout le journal d'incidents (Super Admin).
 */
export const clearLogsRequest = async () => (await apiClient.delete("/logs/clear")).data;

/**
 * Marque un incident comme résolu.
 */
export const resolveLogRequest = async (id) => (await apiClient.patch(`/logs/${id}/resolve`)).data;
