import { contaMovimentacoes } from "@/api/conta";
import { createMovimentacao } from "@/api/movimentacoes";
import type { MovimentacoesRequestDto } from "@/models/movimentacao-model";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateMovimentacao(pessoaId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createMovimentacao"],
		mutationFn: async (data: MovimentacoesRequestDto) => await createMovimentacao(data),
		onSuccess: (_data, movReqDto) => {
			queryClient.invalidateQueries({
				queryKey: ["contaMovimentacoes", pessoaId, movReqDto.contaId],
			});
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
		placeholderData: keepPreviousData,
		queryKey: ["contaMovimentacoes", pessoaId, contaId, page],
		queryFn: async () => {
			if (contaId.length === 0) {
				return defaultDataContaMovimentacoes;
			}
			try {
				return await contaMovimentacoes(contaId, page);
			} catch {
				toast.error("Erro ao buscar conta e movimentações");
				return defaultDataContaMovimentacoes;
			}
		},
	});
};
