import apiClient from "./apiClient";

export const getTeachersRequest = async () => (await apiClient.get("/teachers")).data;
export const createTeacherRequest = async (data) => (await apiClient.post("/teachers", data)).data;
export const deleteTeacherRequest = async (id) => (await apiClient.delete(`/teachers/${id}`)).data;
