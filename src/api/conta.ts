import axios from "axios";
import type { Movimentacoes } from "./movimentacoes";
import type { Pessoa } from "./pessoas";

const base_url = "http://localhost:8080/api/v1/conta";

export type ContaRequestDto = {
	pessoaId: number;
	numeroConta: string;
};

export type ContaResponseDto = {
	id: number;
	movimentacoes: Movimentacao[] | [];
	numero: string;
	saldo: number;
};

export interface Conta {
	id: number;
	pessoa: Pessoa;
	movimentacoes: Movimentacoes[] | [];
	numero: string;
	saldo: number;
}

export type Movimentacao = {
	id: number;
	valor: number;
	// tipo: string;
	dataHora: string;
};

export const criarConta = async (params: ContaRequestDto) => {
	const { data } = await axios.post(base_url, params);
	return data as ContaResponseDto;
};
