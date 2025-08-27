import type { MovimentacoesResponseDto } from "./movimentacao-model";

export type ContaRequestDto = {
	pessoaId: number;
};

export type ContaResponseDto = {
	id: string;
	movimentacoes: MovimentacoesResponseDto[];
	saldo: number;
};

export type ContaMovimentacoesDto = {
	contaId: string;
	movimentacaoId: number;
	valor: number;
	dataMovimentacao: Date;
};

export type ContaMovimentacoesResponseDto = {
	contaMovimentacoes: ContaMovimentacoesDto[];
	saldo: number;
} & Pagination;

type Pagination = {
	pageSize: number;
	totalElements: number;
};
