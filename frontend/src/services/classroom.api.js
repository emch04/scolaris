import apiClient from "./apiClient";
export const getClassroomsRequest = async () => (await apiClient.get("/classrooms")).data;
