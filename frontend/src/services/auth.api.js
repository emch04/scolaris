import apiClient from "./apiClient";

export const loginRequest = async (payload) => (await apiClient.post("/auth/login", payload)).data;

export const logoutRequest = async () => (await apiClient.post("/auth/logout")).data;

export const getMeRequest = async () => (await apiClient.get("/auth/me")).data;

export const registerRequest = async (payload) => (await apiClient.post("/auth/register", payload)).data;

export const forgotPasswordRequest = async (identifier) => (await apiClient.post("/auth/forgot-password", { identifier })).data;

export const resetPasswordRequest = async (payload) => (await apiClient.post("/auth/reset-password", payload)).data;