import { contaMovimentacoes } from "@/api/conta";
import { createMovimentacao } from "@/api/movimentacoes";
import type { ContaMovimentacoesResponseDto } from "@/models/conta-model";
import type { MovimentacoesRequestDto } from "@/models/movimentacao-model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateMovimentacao(pessoaId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createMovimentacao"],
		mutationFn: async (data: MovimentacoesRequestDto) => await createMovimentacao(data),

		onSuccess: (data, movReqDto) => {
			if (!data) return;

			queryClient.setQueryData(
				["contaMovimentacoes", pessoaId, movReqDto.contaId],
				(old: ContaMovimentacoesResponseDto) => {
					const movimentacao = {
						contaId: movReqDto.contaId,
						movimentacaoId: data.id,
						valor: data.valor,
						dataMovimentacao: data.data,
					};
					if (old.totalElements === 0) {
						return {
							contaMovimentacoes: [movimentacao],
							saldo: data.valor,
							pageSize: 1,
							totalElements: 1,
						};
					}

					return {
						contaMovimentacoes: [...old.contaMovimentacoes, movimentacao],
						saldo: old.saldo + data.valor,
						pageSize: old.pageSize + 1,
						totalElements: old.totalElements + 1,
					};
				},
			);
		},
	});
}

const defaultDataContaMovimentacoes = {
	contaMovimentacoes: [],
	saldo: 0,
	pageSize: 0,
	totalElements: 0,
};
export const useContaMovimentacoes = (pessoaId: number, contaId: string, page: number) => {
	return useQuery({
		initialData: defaultDataContaMovimentacoes,
		queryKey: ["contaMovimentacoes", pessoaId, contaId],
		queryFn: async () => {
			if (contaId.length === 0) {
				return defaultDataContaMovimentacoes;
			}
			try {
				return await contaMovimentacoes(contaId, page);
			} catch (_) {
				toast.error("Erro ao buscar conta e movimentações");
				return defaultDataContaMovimentacoes;
			}
		},
	});
};
