import apiClient from "./apiClient";

const getData = async (params) => {
  return await apiClient.get(`?q=${params}`);
};

export default getData;
