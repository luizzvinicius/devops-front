"use server";
import { BASE_URL } from "@/constants/constants";
import type {
	ContaMovimentacoesResponseDto,
	ContaRequestDto,
	ContaResponseDto,
} from "@/models/conta-model";
import axiosInstance from "@/lib/axiosConfig";

const ENTITY = "/conta";

export async function contaMovimentacoes(contaId: string, page: number) {
	const { data } = await axiosInstance.get<ContaMovimentacoesResponseDto>(
		`${BASE_URL}${ENTITY}/${contaId}/movimentacoes`,
		{
			params: {
				page,
			},
		},
	);
	return data;
}

export async function criarConta(params: ContaRequestDto) {
	const { data } = await axiosInstance.post<ContaResponseDto>(`${BASE_URL}${ENTITY}`, params);
	return data;
}

export async function deleteConta(id: string) {
	const { data } = await axiosInstance.delete(`${BASE_URL}${ENTITY}/${id}`);
	return data;
}
