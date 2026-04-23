import apiClient from "./apiClient";
export const getAssignmentsRequest = async (params) => (await apiClient.get("/assignments", { params })).data;
export const createAssignmentRequest = async (payload) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return (await apiClient.post("/assignments", payload, config)).data;
};
