import axios from "axios";

const baseURL = 'http://localhost:8000'

let token = localStorage.getItem('token') ? localStorage.getItem('token'):null;

const axiosInstance = axios.create({
    baseURL,
    headers:{Authorization:token},
  
})

export default axiosInstance;