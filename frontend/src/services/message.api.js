import apiClient from "./apiClient";

export const sendMessageRequest = async (data) => (await apiClient.post("/messages", data)).data;
export const getMyMessagesRequest = async () => (await apiClient.get("/messages/my")).data;
export const getClassroomMessagesRequest = async (classId) => (await apiClient.get(`/messages/classroom/${classId}`)).data;
export const markMessageAsReadRequest = async (id) => (await apiClient.patch(`/messages/read/${id}`)).data;
