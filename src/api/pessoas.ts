"use server";
import { BASE_URL } from "@/constants/constants";
import type {
	PessoaContaResponse,
	PessoaPageDto,
	PessoaRequestDto,
	PessoaResponseDto,
} from "@/models/pessoa-model";
import axiosInstance from "@/lib/axiosConfig";

const ENTITY = "/pessoa";

export async function getAllPessoas(page: number) {
	const { data } = await axiosInstance.get<PessoaPageDto>(`${BASE_URL}${ENTITY}/all`, {
		params: { p: page },
	});
	return data;
}

export async function createPessoa(params: PessoaRequestDto) {
	const { data } = await axiosInstance.post<PessoaResponseDto>(`${BASE_URL}${ENTITY}`, params);
	return data;
}

export async function updatePessoa(id: number, params: PessoaRequestDto) {
	const { data } = await axiosInstance.put<PessoaResponseDto>(
		`${BASE_URL}${ENTITY}/${id}`,
		params,
	);
	return data;
}

export async function deletePessoa(id: number) {
	const { status } = await axiosInstance.delete(`${BASE_URL}${ENTITY}/${id}`);
	return status;
}

export async function buscarPessoasFilter(nome: string, page: number) {
	const { data } = await axiosInstance.get<PessoaPageDto>(`${BASE_URL}${ENTITY}/all/${nome}`, {
		params: { page: page },
	});
	return data;
}

export async function buscarPessoaEConta(id: number) {
	const { data } = await axiosInstance.get<PessoaContaResponse>(
		`${BASE_URL}${ENTITY}/contas/${id}`,
	);
	return data;
}
