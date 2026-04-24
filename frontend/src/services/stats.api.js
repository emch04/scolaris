import apiClient from "./apiClient";

export const getGlobalStatsRequest = async () => (await apiClient.get("/stats/global")).data;
export const getTeacherStatsRequest = async () => (await apiClient.get("/stats/teacher")).data;
