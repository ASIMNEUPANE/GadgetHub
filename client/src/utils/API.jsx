import axios from "axios";
import { SERVER_URL } from "../constants";

const API = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("access_token")
      ? "Bearer " + localStorage.getItem("access_token")
      : null,
  },
});

export default API;
