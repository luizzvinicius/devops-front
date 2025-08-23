import axios from "axios";
import { BASE_URL } from "@/constants/constants";
import type { ContaRequestDto, ContaResponseDto } from "@/models/conta-model";

const ENTITY = "/conta";

export const criarConta = async (params: ContaRequestDto) => {
	const { data } = await axios.post<ContaResponseDto>(`${BASE_URL}${ENTITY}`, params);
	return data;
};

export async function deleteConta(id: string) {
	const { data } = await axios.delete(`${BASE_URL}${ENTITY}/${id}`);
	return data;
}
