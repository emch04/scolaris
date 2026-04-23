import apiClient from "./apiClient";

export const getCommunicationsRequest = async (params) => {
  return (await apiClient.get("/communications", { params })).data;
};

export const createCommunicationRequest = async (payload) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return (await apiClient.post("/communications", payload, config)).data;
};
