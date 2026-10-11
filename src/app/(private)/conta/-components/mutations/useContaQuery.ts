import { buscarPessoaEConta, buscarPessoasFilter } from "@/api/pessoas";
import type { ContaRequestDto } from "@/models/conta-model";
import { criarConta, deleteConta } from "@/api/conta";
import type { PessoaEConta } from "@/models/pessoa-model";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateConta() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createConta"],
		mutationFn: async (data: ContaRequestDto) => await criarConta(data),
		onSuccess: (_createdAccount, criarContaParam) => {
			queryClient.invalidateQueries({
				queryKey: ["buscarPessoaEConta", criarContaParam.pessoaId],
			});
		},
	});
}

export function useDeleteConta(idPessoa: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteConta"],
		mutationFn: async (idConta: string) => await deleteConta(idConta),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["buscarPessoaEConta", idPessoa],
			});
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
			id: 0,
			nome: "",
			cpf: "",
			endereco: "",
			conta_id: "",
			conta_saldo: 0,
		},
	] as PessoaEConta[],
	pageSize: 0,
	totalElements: 0,
};
export const useBuscarPessoaEConta = (id: number, page: number = 0) => {
	return useQuery({
		initialData: defaultDataBuscarPessoaEConta,
		placeholderData: keepPreviousData,
		queryKey: ["buscarPessoaEConta", id, page],
		queryFn: async () => {
			if (id === 0) {
				return defaultDataBuscarPessoaEConta;
			}

			try {
				return await buscarPessoaEConta(id, page);
			} catch {
				toast.error("Erro no servidor ao buscar pessoas e contas");
				return defaultDataBuscarPessoaEConta;
			}
		},
	});
};
