import axios from "axios";

const API = axios.create({
  baseURL:"http://localhost:5000/api",
});
export const getTasks = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createTask = (task, token) =>
  API.post("/tasks", task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  export const getAnalytics = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/analytics/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export default API;