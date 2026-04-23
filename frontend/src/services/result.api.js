import apiClient from "./apiClient";

export const getStudentBulletinRequest = async (studentId) => {
  return (await apiClient.get(`/results/student/${studentId}`)).data;
};

export const addStudentResultRequest = async (payload) => {
  return (await apiClient.post("/results", payload)).data;
};
