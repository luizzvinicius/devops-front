"use server";
import { BASE_URL } from "@/constants/constants";
import axiosInstance from "@/lib/axiosConfig";
import type {
	InvestimentoRequestDto,
	InvestimentoResponseDto,
	InvestimentoRow,
} from "@/models/investimento-model";

const ENTITY = "/investimento";

export async function getContaInvestimentos(idConta: string) {
	const { data } = await axiosInstance.get<InvestimentoRow[]>(`${BASE_URL}${ENTITY}/${idConta}`);
	return data;
}

export async function createInvestimento(params: InvestimentoRequestDto) {
	const { data } = await axiosInstance.post<InvestimentoResponseDto>(
		`${BASE_URL}${ENTITY}`,
		params,
	);
	return data;
}
