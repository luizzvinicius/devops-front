import type { ContaRequestDto } from "@/models/conta-model";
import { buscarPessoaEConta, buscarPessoasFilter } from "@/api/pessoas";
import { criarConta, deleteConta } from "@/api/conta";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PessoaContaResponse, PessoaPageDto } from "@/models/pessoa-model";

export function useCreateConta() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["buscarPessoaEConta"],
		mutationFn: async (data: ContaRequestDto) => await criarConta(data),

		onError: e => {
			console.log("Erro ao criar conta:", e);
		},

		onSuccess: (createdAccount, pessoaId) => {
			const pessoas: PessoaPageDto | undefined = queryClient.getQueryData(["pessoas"]);
			if (!createdAccount || !pessoaId || !pessoas) return;

			const pessoa = pessoas.pessoas.find(p => p.id === pessoaId.pessoaId);
			console.log("pessoa encontrada", pessoa);

			queryClient.setQueryDefaults(["buscarPessoaEConta"], {
				enabled: true,
			});
			queryClient.setQueryData(["buscarPessoaEConta"], (old: PessoaContaResponse) => {
				console.log(old);

				const updatedPessoaEConta = old.pessoaAndContaDtoList.map(p =>
					p.id === pessoa?.id
						? {
								...p,
								conta_id: createdAccount.id,
								conta_saldo: createdAccount.saldo,
							}
						: p,
				);
				console.log(updatedPessoaEConta);

				return {
					page: 0,
					pageSize: 1,
					pessoaAndContaDtoList: [...old.pessoaAndContaDtoList, ...updatedPessoaEConta],
				};
			});
		},
	});
}

export function useDeleteConta() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteConta"],
		mutationFn: async (idConta: string) => {
			await deleteConta(idConta);
		},

		onError: e => {
			console.log("Erro ao deletar conta:", e);
		},

		onSuccess: (_, idConta) => {
			queryClient.setQueryData(["pessoas"], (old: PessoaContaResponse) => {
				console.log(old);
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
		initialData: {
			pessoaAndContaDtoList: [
				{
					conta_id: "",
					conta_saldo: 0,
					cpf: "",
					endereco: "",
					id: 0,
					nome: "",
				},
			],
			pageSize: 0,
			totalPages: 0,
		},
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
