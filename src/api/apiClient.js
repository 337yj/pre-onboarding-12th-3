import axios from "axios";

const BASE_URL = "https://dusty-titanium-middle.glitch.me/sick";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

apiClient.interceptors.request.use(async (config) => {
  config.headers["Content-Type"] = "application/json";
  return config;
});

export default apiClient;
