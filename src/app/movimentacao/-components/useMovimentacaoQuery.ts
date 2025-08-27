import { contaMovimentacoes } from "@/api/conta";
import { createMovimentacao } from "@/api/movimentacoes";
import type { ContaMovimentacoesResponseDto } from "@/models/conta-model";
import type { MovimentacoesRequestDto } from "@/models/movimentacao-model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateMovimentacao() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createMovimentacao"],
		mutationFn: async (data: MovimentacoesRequestDto) => await createMovimentacao(data),

		onSuccess: data => {
			if (!data) return;

			queryClient.setQueryData(
				["contaMovimentacoes"],
				(old: ContaMovimentacoesResponseDto) => {
					return {
						contaMovimentacoes: [...old.contaMovimentacoes, data],
						saldo: old.saldo + data.valor,
						pageSize: old.pageSize + 1,
						totalElements: old.totalElements + 1,
					};
				},
			);
		},
	});
}

export const useContaMovimentacoes = (contaId: string, page: number) => {
	return useQuery({
		initialData: {
			contaMovimentacoes: [],
			saldo: 0,
			pageSize: 0,
			totalElements: 0,
		},
		enabled: contaId.length > 0,
		queryKey: ["contaMovimentacoes"],
		queryFn: async () => {
			const request = await contaMovimentacoes(contaId, page);
			if (!request) {
				return Promise.reject();
			}
			return request;
		},
	});
};

export function useDeleteMovimentacao() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteMovimentacao"],
		mutationFn: async (data: MovimentacoesRequestDto) => await deleteMovimentacao(data),
	});
}
