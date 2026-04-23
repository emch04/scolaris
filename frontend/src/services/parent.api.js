import apiClient from "./apiClient";

export const getParentDashboardRequest = async () => (await apiClient.get("/parents/dashboard")).data;

export const getParentsRequest = async () => (await apiClient.get("/parents")).data;

export const updateParentRequest = async (id, payload) => (await apiClient.put(`/parents/${id}`, payload)).data;
