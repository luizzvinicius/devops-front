import { buscarPessoaEConta, buscarPessoasFilter } from "@/api/pessoas";
import type { ContaRequestDto } from "@/models/conta-model";
import { criarConta, deleteConta } from "@/api/conta";
import type { PessoaContaResponse, PessoaPageDto } from "@/models/pessoa-model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateConta(nome: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["buscarPessoaEConta"],
		mutationFn: async (data: ContaRequestDto) => await criarConta(data),

		onSuccess: (createdAccount, criarContaParam) => {
			queryClient.setQueryData(
				["buscarPessoaEConta", criarContaParam.pessoaId],
				(old: PessoaContaResponse) => {
					if (old.pessoaAndContaDtoList.length === 0) {
						const pessoas: PessoaPageDto | undefined = queryClient.getQueryData([
							"pessoasFiltered",
							nome,
						]);
						if (!createdAccount || !criarContaParam || !pessoas) return;
						const pessoa = pessoas.pessoas.find(p => p.id === criarContaParam.pessoaId);
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
				},
			);
		},
	});
}

export function useDeleteConta(idPessoa: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteConta"],
		mutationFn: async (idConta: string) => await deleteConta(idConta),

		onSuccess: (_, idConta) => {
			queryClient.setQueryData(
				["buscarPessoaEConta", idPessoa],
				(old: PessoaContaResponse) => {
					if (!old) return;
					const updated = old.pessoaAndContaDtoList.filter(
						pessoa => pessoa.conta_id !== idConta,
					);

					return {
						pessoaAndContaDtoList: [...updated],
						pageSize: old.pageSize - 1,
						totalElements: old.totalElements - 1,
					};
				},
			);
		},
	});
}

const defaultDataPessoasConta = {
	pessoas: [],
	pageSize: 0,
	totalElements: 0,
};
export const usePessoasConta = (nome: string, page: number) => {
	return useQuery({
		initialData: defaultDataPessoasConta,
		queryKey: ["pessoasFiltered", nome],
		queryFn: async () => {
			if (nome.length === 0) {
				return defaultDataPessoasConta;
			}
			try {
				return await buscarPessoasFilter(nome, page);
			} catch {
				toast.error("Erro no servidor ao buscar pessoa");
				return defaultDataPessoasConta;
			}
		},
	});
};

const defaultDataBuscarPessoaEConta = {
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
};
export const useBuscarPessoaEConta = (id: number) => {
	return useQuery({
		initialData: defaultDataBuscarPessoaEConta,
		queryKey: ["buscarPessoaEConta", id],
		queryFn: async () => {
			try {
				return await buscarPessoaEConta(id);
			} catch {
				toast.error("Erro no servidor ao buscar pessoas e contas");
				return defaultDataBuscarPessoaEConta;
			}
		},
	});
};
