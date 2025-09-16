import axios from "axios";
import { BASE_URL } from "@/constants/constants";
import type { Token } from "@/models/auth.model";

const ENTITY = "/auth";

export async function login(email: string, password: string) {
	const { data } = await axios.post<Token>(`${BASE_URL}${ENTITY}/login`, { email, password });
	return data;
}

export async function logout(id: string) {
	const { data } = await axios.post(`${BASE_URL}${ENTITY}/logout/${id}`);
	return data;
}
