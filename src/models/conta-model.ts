import type { MovimentacoesResponseDto } from "./movimentacao-model";

export type ContaRequestDto = {
	pessoaId: number;
};

export type ContaResponseDto = {
	id: string;
	movimentacoes: MovimentacoesResponseDto[];
	saldo: number;
};
