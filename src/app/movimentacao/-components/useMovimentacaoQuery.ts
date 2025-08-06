import { createMovimentacao, type MovimentacoesRequestDto } from "@/api/movimentacoes";
import type { PessoaPageDto } from "@/api/pessoas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateMovimentacao() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createMovimentacao"],
		mutationFn: async (data: MovimentacoesRequestDto) => await createMovimentacao(data),

		onError: e => {
			console.log("Erro ao criar movimentacao:", e);
		},

		onSuccess: async data => {
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
												dataHora: data.dataHora,
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
					totalElements: old.totalElements + 1,
				};
			});
		},
	});
}
