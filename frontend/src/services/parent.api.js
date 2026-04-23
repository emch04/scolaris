import apiClient from "./apiClient";
export const getParentDashboardRequest = async () => (await apiClient.get("/parents/dashboard")).data;
