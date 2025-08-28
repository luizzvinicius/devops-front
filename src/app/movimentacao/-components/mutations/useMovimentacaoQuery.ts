import { contaMovimentacoes } from "@/api/conta";
import { createMovimentacao } from "@/api/movimentacoes";
import type { ContaMovimentacoesResponseDto } from "@/models/conta-model";
import type { MovimentacoesRequestDto } from "@/models/movimentacao-model";
import type { PessoaContaResponse } from "@/models/pessoa-model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateMovimentacao() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createMovimentacao"],
		mutationFn: async (data: MovimentacoesRequestDto) => await createMovimentacao(data),

		onSuccess: (data, movReqDto) => {
			if (!data) return;

			queryClient.setQueryData(
				["contaMovimentacoes"],
				(old: ContaMovimentacoesResponseDto) => {
					if (old.totalElements === 0) {
						const pessoas: PessoaContaResponse | undefined = queryClient.getQueryData([
							"buscarPessoaEConta",
						]);
						const selectPessoa = pessoas?.pessoaAndContaDtoList.find(
							p => p.conta_id === movReqDto.contaId,
						);
						return {
							contaMovimentacoes: [
								{
									contaId: selectPessoa?.conta_id,
									movimentacaoId: data.id,
									valor: data.valor,
									dataMovimentacao: data.data,
								},
							],
							saldo: data.valor,
							pageSize: 1,
							totalElements: 1,
						};
					}

					return {
						contaMovimentacoes: [
							...old.contaMovimentacoes,
							{
								contaId: old.contaMovimentacoes[0].contaId,
								movimentacaoId: data.id,
								valor: data.valor,
								dataMovimentacao: data.data,
							},
						],
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
