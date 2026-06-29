import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});
export const getTasks = () => API.get("/tasks");

export const createTask = (task, token) =>
  API.post("/tasks", task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export default API;