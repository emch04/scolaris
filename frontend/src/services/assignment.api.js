import apiClient from "./apiClient";
export const getAssignmentsRequest = async () => (await apiClient.get("/assignments")).data;
export const createAssignmentRequest = async (payload) => (await apiClient.post("/assignments", payload)).data;
