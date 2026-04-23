import apiClient from "./apiClient";

export const addTimetableEntryRequest = async (data) => (await apiClient.post("/timetable", data)).data;
export const getClassroomTimetableRequest = async (classroomId) => (await apiClient.get(`/timetable/classroom/${classroomId}`)).data;
export const deleteTimetableEntryRequest = async (id) => (await apiClient.delete(`/timetable/${id}`)).data;
