import { api } from "@/lib/api";
import type {
	PessoaContaResponse,
	PessoaPageDto,
	PessoaRequestDto,
	PessoaResponseDto,
} from "@/models/pessoa-model";

const ENTITY = "/pessoa";

export const getAllPessoas = async (page: number) => {
	const { data } = await api.get<PessoaPageDto>(`${ENTITY}/all`, {
		params: { p: page },
	});

	return data;
};

export const createPessoa = async (params: PessoaRequestDto) => {
	const { data } = await api.post<PessoaResponseDto>(`${ENTITY}`, params);
	return data;
};

export const updatePessoa = async (id: number, params: PessoaRequestDto) => {
	const { data } = await api.put<PessoaResponseDto>(`${ENTITY}/${id}`, params);
	return data;
};

export const deletePessoa = async (id: number) => {
	const { status } = await api.delete(`${ENTITY}/${id}`);
	return status;
};

export async function buscarPessoasFilter(nome: string, page: number) {
	const { data } = await api.get<PessoaPageDto>(`${ENTITY}/all/${nome}`, {
		params: { page: page },
	});
	return data;
}

export async function buscarPessoaEConta(id: number) {
	const { data } = await api.get<PessoaContaResponse>(`${ENTITY}/contas/${id}`);
	return data;
}
