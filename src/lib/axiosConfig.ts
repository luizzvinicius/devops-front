import axios, { type InternalAxiosRequestConfig, type AxiosInstance } from "axios";
import { BASE_URL } from "@/constants/constants";
import { getToken } from "@/service/authService";

const axiosInstance: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 3000,
});

axiosInstance.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		const token = await getToken("session");
		config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	error => Promise.reject(error),
);

export default axiosInstance;
