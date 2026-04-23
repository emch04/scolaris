import apiClient from "./apiClient";

export const getGlobalStatsRequest = async () => (await apiClient.get("/stats/global")).data;
