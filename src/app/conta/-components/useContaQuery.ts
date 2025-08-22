import { criarConta } from "@/api/conta";
import { type ContaRequestDto, ContaResponseDto } from "@/models/conta-model";
import type { PessoaPageDto } from "@/models/pessoa-model";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateConta() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createConta"],
		mutationFn: async (data: ContaRequestDto) => await criarConta(data),

		onError: e => {
			console.log("Erro ao criar conta:", e);
		},

		onSuccess: data => {
			if (!data) return;

			queryClient.setQueryData(["pessoas"], (old: PessoaPageDto) => {
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
