import apiClient from "./apiClient";

export const getResourcesRequest = async (params) => (await apiClient.get("/resources", { params })).data;
export const addResourceRequest = async (data) => {
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  return (await apiClient.post("/resources", data, config)).data;
};
export const deleteResourceRequest = async (id) => (await apiClient.delete(`/resources/${id}`)).data;
