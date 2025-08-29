import axios from "axios";
import { BASE_URL } from "@/constants/constants";
import type {
	PessoaContaResponse,
	PessoaEConta,
	PessoaPageDto,
	PessoaRequestDto,
	PessoaResponseDto,
} from "@/models/pessoa-model";
import { ContaResponseDto } from "@/models/conta-model";

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
	// const { data } = await axios.get<PessoaPageDto>(`${BASE_URL}${ENTITY}/all/${nome}`, {
	// 	params: { page: page },
	// });
	// return data;
	const mock: PessoaPageDto = {
		pageSize: 1,
		totalElements: 1,
		pessoas: [
			{
				cpf: "11111111111",
				endereco: "rua tal",
				id: 1,
				nome: "luiz",
				contas: [
					{
						id: "blabla",
						movimentacoes: [],
						saldo: 0,
					},
				] as ContaResponseDto[],
			},
		] as PessoaResponseDto[],
	};
	return await Promise.resolve(mock);
}

export async function buscarPessoaEConta(id: number) {
	// const { data } = await axios.get<PessoaContaResponse>(`${BASE_URL}${ENTITY}/contas/${id}`);
	// return data;
	const mock: PessoaContaResponse = {
		pageSize: 1,
		totalElements: 1,
		pessoaAndContaDtoList: [
			{
				conta_id: "blabla",
				conta_saldo: 0,
				cpf: "11111111111",
				endereco: "rua tal",
				id: 1,
				nome: "luiz",
			},
		] as PessoaEConta[],
	};
	return await Promise.resolve(mock);
}
