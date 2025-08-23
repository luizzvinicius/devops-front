import axios from "axios";
import { BASE_URL } from "@/constants/constants";
import type {
	PessoaContaRow,
	PessoaPageDto,
	PessoaRequestDto,
	PessoaResponseDto,
} from "@/models/pessoa-model";

const ENTITY = "/pessoa";

export const getAllPessoas = async (page: number) => {
	const { data } = await axios.get<PessoaPageDto>(`${BASE_URL}${ENTITY}/all`, {
		params: { p: page },
	});

	return data;
};

export const createPessoa = async (params: PessoaRequestDto) => {
	const { data } = await axios.post<PessoaResponseDto>(`${BASE_URL}${ENTITY}`, params);
	return data;
};

export const updatePessoa = async (id: number, params: PessoaRequestDto) => {
	const { data } = await axios.put<PessoaResponseDto>(`${BASE_URL}${ENTITY}/${id}`, params);
	return data;
};

export const deletePessoa = async (id: number) => {
	const { status } = await axios.delete(`${BASE_URL}${ENTITY}/${id}`);
	return status;
};

export async function buscarPessoasFilter(nome: string, page: number) {
	const { data } = await axios.get<PessoaPageDto>(`${BASE_URL}${ENTITY}/all/${nome}`, {
		params: { page: page },
	});
	return data;
}

export async function buscarPessoaEConta(id: number) {
	const { data } = await axios.get<PessoaContaRow[]>(`${BASE_URL}${ENTITY}/contas/${id}`);
	return data;
}
