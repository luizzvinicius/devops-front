type Movimentacoes = {
	id: number;
	valor: number;
	data: Date;
};

const OperacaoEnum = {
	DEPOSITO: "DEPOSITO",
	SAQUE: "SAQUE",
} as const;

export type OperacaoEnum = (typeof OperacaoEnum)[keyof typeof OperacaoEnum];

export type MovimentacoesRequestDto = {
	contaId: string;
	valor: number;
	tipoMovimentacao: OperacaoEnum;
};

export type MovimentacoesResponseDto = Movimentacoes;
