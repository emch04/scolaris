import apiClient from "./apiClient";

/**
 * Récupère tous les interrupteurs système.
 */
export const getSystemConfigsRequest = async () => (await apiClient.get("/system-config")).data;

/**
 * Active ou Désactive une fonctionnalité.
 */
export const toggleSystemFeatureRequest = async (key, enabled) => (await apiClient.patch(`/system-config/${key}`, { enabled })).data;
