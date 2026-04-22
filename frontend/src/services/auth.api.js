import apiClient from "./apiClient";
export const loginRequest = async (payload) => (await apiClient.post("/auth/login", payload)).data;
export const registerRequest = async (payload) => (await apiClient.post("/auth/register", payload)).data;
