import { type ContaRequestDto, criarConta } from "@/api/conta";
import type { PessoaPageDto } from "@/api/pessoas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateConta() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createConta"],
		mutationFn: async (data: ContaRequestDto) => await criarConta(data),

		// onError: e => {
		// 	console.log("Erro ao criar conta:", e);
		// },

		onSuccess: async data => {
			if (!data) return;

			queryClient.setQueryData(["pessoas"], (old: PessoaPageDto | undefined) => {
				if (!old) return;
				const updated = old.pessoas.map(pessoa =>
					pessoa.id === data.id
						? {
								nome: pessoa.nome,
								cpf: pessoa.cpf,
								conta: [
									{
										id: data.id,
										movimentacoes: data.movimentacoes,
										numero: data.numero,
										saldo: data.saldo,
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
