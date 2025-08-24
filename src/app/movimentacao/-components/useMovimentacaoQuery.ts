import { createMovimentacao } from "@/api/movimentacoes";
import type { MovimentacoesRequestDto } from "@/models/movimentacao-model";
import type { PessoaPageDto } from "@/models/pessoa-model";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateMovimentacao() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createMovimentacao"],
		mutationFn: async (data: MovimentacoesRequestDto) => await createMovimentacao(data),

		onError: e => {
			console.log("Erro ao criar movimentacao:", e);
		},

		onSuccess: data => {
			if (!data) return;

			queryClient.setQueryData(["pessoas"], (old: PessoaPageDto) => {
				const updated = old.pessoas.map(pessoa =>
					pessoa.id === data.id
						? {
								nome: pessoa.nome,
								cpf: pessoa.cpf,
								conta: [
									{
										id: data.id,
										movimentacoes: [
											{
												id: data.id,
												valor: data.valor,
												dataHora: data.data,
											},
										],
									},
								],
							}
						: pessoa,
				);

				return {
					...old,
					pessoas: [...updated],
					totalElements: old.pageSize + 1,
				};
			});
		},
	});
}

export function useDeleteMovimentacao() {
	const queryClient = useQueryClient();
	return useMutation({});
}
