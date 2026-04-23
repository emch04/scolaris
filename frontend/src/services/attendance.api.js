import apiClient from "./apiClient";

export const markAttendanceRequest = async (data) => (await apiClient.post("/attendance", data)).data;
export const getStudentAttendanceRequest = async (studentId) => (await apiClient.get(`/attendance/student/${studentId}`)).data;
export const getClassroomAttendanceRequest = async (classroomId, date) => (await apiClient.get(`/attendance/classroom/${classroomId}?date=${date}`)).data;
