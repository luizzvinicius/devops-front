import { buscarPessoaEConta, buscarPessoasFilter } from "@/api/pessoas";
import type { ContaRequestDto } from "@/models/conta-model";
import { criarConta, deleteConta } from "@/api/conta";
import type { PessoaPageDto } from "@/models/pessoa-model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
					pessoa.id === Number(data.id)
						? {
								...pessoa,
								conta: [...pessoa.contas, data],
							}
						: pessoa,
				);

				return {
					...old,
					pessoas: [...old.pessoas, updated],
					pageSize: old.pageSize + 1,
				};
			});
		},
	});
}

export function useDeleteConta() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteConta"],
		mutationFn: async (idConta?: string) => {
			if (!idConta) return;
			await deleteConta(idConta);
		},

		onError: e => {
			console.log("Erro ao deletar conta:", e);
		},

		onSuccess: (data, idPessoa, idConta) => {
			console.log(data, idPessoa, idConta);

			if (!data) return;

			queryClient.setQueryData(["pessoas"], (old: PessoaPageDto) => {
				if (!old) return;

				const updated = old.pessoas.filter(pessoa => {
					if (pessoa.id) {
						pessoa.contas.filter(conta => conta.id !== idConta);
					}
				});

				return {
					...old,
					pessoas: [...old.pessoas, updated],
					pageSize: old.pageSize - 1,
				};
			});
		},
	});
}

export const usePessoasConta = (nome: string, page: number, enabled: boolean) => {
	return useQuery({
		initialData: {
			pessoas: [],
			pageSize: 0,
			totalPages: 0,
		},
		enabled,
		queryKey: ["pessoasFiltered"],
		queryFn: async () => {
			console.log("chamou");
			const request = await buscarPessoasFilter(nome, page);
			if (!request) {
				return Promise.reject();
			}
			return request;
		},
	});
};

export const useBuscarPessoaEConta = (id: number) => {
	return useQuery({
		initialData: [
			{
				id: 0,
				nome: "",
				cpf: "",
				endereco: "",
				conta_id: "",
				conta_saldo: 0,
			},
		],
		enabled: id > 0,
		queryKey: ["buscarPessoaEConta"],
		queryFn: async () => {
			console.log("chamou");
			const request = await buscarPessoaEConta(id);
			if (!request) {
				return Promise.reject();
			}
			return request;
		},
	});
};
