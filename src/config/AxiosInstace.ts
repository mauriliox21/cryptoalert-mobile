import axios, { AxiosError } from "axios";
import { useUserRepository } from "../database/useUserRepository";

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error: AxiosError) {

    return Promise.reject(error);
  });

export const AxiosInstance = axios.create({
    // baseURL: 'http://localhost:8080/api/v1'
    baseURL: 'http://192.168.1.196:8080/api/v1'
});

