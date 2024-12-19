import axios from "axios";

const BASE_URL = "/api";

export const axiosCustomized = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
