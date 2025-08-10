import type { MovimentacoesResponseDto } from "./movimentacao-model";

export type ContaRequestDto = {
	pessoaId: number;
};

export type ContaResponseDto = {
	id: number;
	movimentacoes: MovimentacoesResponseDto[];
	saldo: number;
};
