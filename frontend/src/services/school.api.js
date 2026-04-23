import apiClient from "./apiClient";

export const getSchoolsRequest = async () => (await apiClient.get("/schools")).data;
export const getSchoolByIdRequest = async (id) => (await apiClient.get(`/schools/${id}`)).data;
export const createSchoolRequest = async (payload) => (await apiClient.post("/schools", payload)).data;
export const validateSchoolRequest = async (id, status) => (await apiClient.patch(`/schools/${id}/validate`, { status })).data;