import axios from "axios";

const base_url = "http://localhost:8080/api/v1/movimentacoes";

export interface MovimentacoesRequestDto {
	contaId: number;
	valor: number;
	tipoMovimentacao: string;
}

export interface Movimentacoes {
	id: number;
	valor: number;
	dataHora: string;
}

export interface ContaDto {
	id: number;
	numero: string;
	saldo: number;
}

export const createMovimentacao = async (params: MovimentacoesRequestDto) => {
	const { data } = await axios.post<Movimentacoes>(base_url, params);
	return data;
};
