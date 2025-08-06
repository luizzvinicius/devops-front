import axios from "axios";
import type { ContaResponseDto } from "./conta";

const base_url = "http://localhost:8080/api/v1/pessoa";

export interface PessoaRequestDto {
	nome: string;
	cpf: string;
	endereco: string;
}

export interface PessoaResponseDto {
	id: number;
	nome: string;
	cpf: string;
	endereco: string;
	conta: ContaResponseDto[] | [];
}

export interface Pessoa {
	id: number;
	conta: ContaResponseDto[] | [];
	nome: string;
	cpf: string;
	endereco: string;
}

export interface PessoaPageDto {
	pessoas: {
		id: number;
		nome: string;
		cpf: string;
		endereco: string;
		conta:
			| {
					id: number;
					pessoa: Pessoa;
					movimentacoes:
						| {
								id: number;
								// conta: ContaDto;
								valor: number;
								// tipo: string;
								dataHora: string; // timestamp?
						  }[]
						| [];
					numero: string;
					saldo: number;
			  }[]
			| [];
	}[];
	totalPages: number;
	totalElements: number;
}

export const getAllPessoas = async (page: number) => {
	const request = await axios.get<PessoaPageDto>(`${base_url}/all`, {
		params: { p: page },
	});

	return request;
};

export const createPessoa = async (params: PessoaRequestDto) => {
	const { data } = await axios.post<PessoaResponseDto>(base_url, params);
	return data;
};

export const updatePessoa = async (id: number, params: PessoaRequestDto) => {
	const { data } = await axios.put<PessoaResponseDto>(`${base_url}/${id}`, params);
	return data;
};

export const deletePessoa = async (id: number) => {
	await axios.delete(`${base_url}/${id}`);
};
