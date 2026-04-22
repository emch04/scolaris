import apiClient from "./apiClient";
export const getStudentsRequest = async () => (await apiClient.get("/students")).data;
export const createStudentRequest = async (payload) => (await apiClient.post("/students", payload)).data;
