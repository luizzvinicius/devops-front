export const InvestimentoDesc = {
	1: "Renda fixa 10%",
	2: "Renda fixa 15%",
	3: "Fundo de investimentos",
} as const;

export type InvestimentoValue = keyof typeof InvestimentoDesc;

export type InvestimentoRequestDto = {
	idConta: string;
	tipoInvestimento: number;
	aporte: number;
};

export type InvestimentoResponseDto = {
	idInvestimento: number;
	tipoInvestimento: string;
	totalInvestido: number;
	resgate: Date;
};

export type ContaInvestimentos = {
	idConta: string;
	tipoInvestimento: string;
	totalInvestido: number;
	resgate: Date;
};

export type InvestimentoRow = {
	idConta: string;
	tipoInvestimento: string;
	totalInvestido: number;
	resgate: Date;
};
