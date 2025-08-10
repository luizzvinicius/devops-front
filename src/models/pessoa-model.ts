import type { ContaResponseDto } from "./conta-model";

type Pessoa = {
	id: number;
	nome: string;
	cpf: string;
	endereco: string;
};

export type PessoaRequestDto = Omit<Pessoa, "id">;

export type PessoaResponseDto = Pessoa & {
	contas: ContaResponseDto[];
};

export type PessoaPageDto = Pagination & {
	pessoas: PessoaResponseDto[];
};

export type Pagination = {
	pageSize: number;
	totalPages: number;
};
