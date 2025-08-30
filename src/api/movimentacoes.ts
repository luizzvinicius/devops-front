import axios from "axios";
import { BASE_URL } from "@/constants/constants";
import type {
	MovimentacoesRequestDto,
	MovimentacoesResponseDto,
} from "@/models/movimentacao-model";

const ENTITY = "/movimentacoes";

export const createMovimentacao = async (params: MovimentacoesRequestDto) => {
	const { data } = await axios.post<MovimentacoesResponseDto>(`${BASE_URL}${ENTITY}`, params);
	return data;
};

export async function deleteMovimentacao(idMovimentacao: number) {
	await axios.delete(`${BASE_URL}${ENTITY}/${idMovimentacao}`);
}
