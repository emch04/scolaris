import apiClient from "./apiClient";

export const getSchoolsRequest = async () => (await apiClient.get("/schools")).data;

export const createSchoolRequest = async (payload) => (await apiClient.post("/schools", payload)).data;