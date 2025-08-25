type Movimentacoes = {
	id: number;
	valor: number;
	data: Date;
};

// export enum OperacaoEnum {
// 	DEPOSITO = "Depósito", SAQUE = "Saque"
// }

// export type Operacao = keyof typeof OperacaoEnum;

export const Operacao = {
	DEPOSITO: "DEPOSITO",
	SAQUE: "SAQUE"
} as const

export type OperacaoValue = keyof typeof Operacao;

export type MovimentacoesRequestDto = {
	contaId: string;
	valor: number;
	tipoMovimentacao: OperacaoValue;
};

export type MovimentacoesResponseDto = Movimentacoes;

export type MovimentacoesRow = MovimentacoesResponseDto & {
	conta_id: string;
};
