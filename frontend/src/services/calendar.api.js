import apiClient from "./apiClient";

export const getCalendarRequest = async () => (await apiClient.get("/calendar")).data;
export const addEventRequest = async (data) => (await apiClient.post("/calendar", data)).data;
