import { api } from "@/lib/api";
import type {
	MovimentacoesRequestDto,
	MovimentacoesResponseDto,
} from "@/models/movimentacao-model";

const ENTITY = "/movimentacoes";

export const createMovimentacao = async (params: MovimentacoesRequestDto) => {
	const { data } = await api.post<MovimentacoesResponseDto>(`${ENTITY}`, params);
	return data;
};

export async function deleteMovimentacao(idMovimentacao: number) {
	await api.delete(`${ENTITY}/${idMovimentacao}`);
}
