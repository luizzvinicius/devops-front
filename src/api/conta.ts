import { api } from "@/lib/api";

import type {
	ContaMovimentacoesResponseDto,
	ContaRequestDto,
	ContaResponseDto,
} from "@/models/conta-model";

const ENTITY = "/conta";

export async function contaMovimentacoes(contaId: string, page: number) {
	const { data } = await api.get<ContaMovimentacoesResponseDto>(
		`${ENTITY}/${contaId}/movimentacoes`,
		{
			params: {
				page,
			},
		},
	);
	return data;
}

export const criarConta = async (params: ContaRequestDto) => {
	const { data } = await api.post<ContaResponseDto>(`${ENTITY}`, params);
	return data;
};

export async function deleteConta(id: string) {
	const { data } = await api.delete(`${ENTITY}/${id}`);
	return data;
}
