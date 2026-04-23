import apiClient from "./apiClient";

export const submitAssignmentSignatureRequest = async (payload) => {
  return (await apiClient.post("/submissions", payload)).data;
};

export const getAssignmentSubmissionsRequest = async (assignmentId) => {
  return (await apiClient.get(`/submissions/assignment/${assignmentId}`)).data;
};
