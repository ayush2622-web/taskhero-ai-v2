import axios from "axios";

const API = axios.create({
  baseURL: "https://taskhero-ai-v2.onrender.com/api",
});
export const getTasks = () => API.get("/tasks");

export const createTask = (task, token) =>
  API.post("/tasks", task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export default API;