"use server";
import { BASE_URL } from "@/constants/constants";
import type {
	MovimentacoesRequestDto,
	MovimentacoesResponseDto,
} from "@/models/movimentacao-model";
import axiosInstance from "@/lib/axiosConfig";

const ENTITY = "/movimentacoes";

export async function createMovimentacao(params: MovimentacoesRequestDto) {
	const { data } = await axiosInstance.post<MovimentacoesResponseDto>(
		`${BASE_URL}${ENTITY}`,
		params,
	);
	return data;
}

export async function deleteMovimentacao(idMovimentacao: number) {
	await axiosInstance.delete(`${BASE_URL}${ENTITY}/${idMovimentacao}`);
}
