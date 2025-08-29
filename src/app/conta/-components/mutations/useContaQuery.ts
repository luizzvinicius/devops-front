import { buscarPessoaEConta, buscarPessoasFilter } from "@/api/pessoas";
import type { ContaRequestDto } from "@/models/conta-model";
import { criarConta, deleteConta } from "@/api/conta";
import type { PessoaContaResponse, PessoaPageDto } from "@/models/pessoa-model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateConta() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["buscarPessoaEConta"],
		mutationFn: async (data: ContaRequestDto) => await criarConta(data),

		onSuccess: (createdAccount, pessoaId) => {
			queryClient.setQueryData(["buscarPessoaEConta"], (old: PessoaContaResponse) => {
				if (old.pessoaAndContaDtoList.length === 0) {
					const pessoas: PessoaPageDto | undefined = queryClient.getQueryData([
						"pessoasFiltered",
					]);
					if (!createdAccount || !pessoaId || !pessoas) return;
					const pessoa = pessoas.pessoas.find(p => p.id === pessoaId.pessoaId);
					if (!pessoa) return;
					return {
						pessoaAndContaDtoList: [
							{
								id: pessoa.id,
								nome: pessoa.nome,
								cpf: pessoa.cpf,
								endereco: pessoa.endereco,
								conta_id: createdAccount.id,
								conta_saldo: createdAccount.saldo,
							},
						],
						pageSize: old.pageSize + 1,
						totalElements: old.totalElements + 1,
					};
				}

				const baseRegister = old.pessoaAndContaDtoList[0];

				const updatedPessoaEConta = {
					id: baseRegister.id,
					nome: baseRegister.nome,
					cpf: baseRegister.cpf,
					endereco: baseRegister.endereco,
					conta_id: createdAccount.id,
					conta_saldo: createdAccount.saldo,
				};

				return {
					pessoaAndContaDtoList: [...old.pessoaAndContaDtoList, updatedPessoaEConta],
					pageSize: old.pageSize + 1,
					totalElements: old.totalElements + 1,
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

		onSuccess: (_, idConta) => {
			queryClient.setQueryData(["buscarPessoaEConta"], (old: PessoaContaResponse) => {
				if (!old) return;
				const updated = old.pessoaAndContaDtoList.filter(
					pessoa => pessoa.conta_id !== idConta,
				);

				return {
					pessoaAndContaDtoList: [...updated],
					pageSize: old.pageSize - 1,
					totalElements: old.totalElements - 1,
				};
			});
		},
	});
}

export const usePessoasConta = (nome: string, page: number) => {
	return useQuery({
		initialData: {
			pessoas: [],
			pageSize: 0,
			totalElements: 0,
		},
		enabled: nome.length > 0,
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
			totalElements: 0,
		},
		enabled: id > 0,
		queryKey: ["buscarPessoaEConta"],
		queryFn: async () => {
			const request = await buscarPessoaEConta(id);
			if (!request) {
				return Promise.reject();
			}
			return request;
		},
	});
};
