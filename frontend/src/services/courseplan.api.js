import apiClient from "./apiClient";

export const getCoursePlansRequest = async (classId) => (await apiClient.get(`/course-plans/classroom/${classId}`)).data;
export const addCoursePlanRequest = async (data) => (await apiClient.post("/course-plans", data)).data;
