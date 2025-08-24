import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPessoa, deletePessoa, getAllPessoas, updatePessoa } from "@/api/pessoas";
import type { PessoaPageDto, PessoaRequestDto } from "@/models/pessoa-model";

export const useGetPessoas = (page: number) => {
	return useQuery({
		initialData: {
			pessoas: [],
			pageSize: 0,
			totalElements: 0,
		},
		queryKey: ["pessoas"],
		queryFn: async () => {
			const request = await getAllPessoas(page);
			if (!request) {
				return Promise.reject();
			}
			return request;
		},
	});
};

export function useCreatePessoa() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createPessoa"],
		mutationFn: async (data: PessoaRequestDto) => await createPessoa(data),

		onError: e => {
			console.error("Erro ao criar pessoa:", e);
		},

		onSuccess: data => {
			if (!data) return;

			queryClient.setQueryData(["pessoas"], (old: PessoaPageDto) => {
				if (!old || old.pessoas.length === 0) {
					return {
						pessoas: [data],
						pageSize: 1,
						totalElements: 0,
					};
				}

				return {
					...old,
					pessoas: [...old.pessoas, data],
					pageSize: old.pageSize + 1,
					totalElements: old.totalElements + 1,
				};
			});
		},
	});
}

export function useUpdatePessoa() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["updatePessoa"],
		mutationFn: async ({ idparam, data }: { idparam: number; data: PessoaRequestDto }) =>
			await updatePessoa(idparam, data),

		onError: e => {
			console.error("Erro ao atualizar pessoa:", e);
		},

		onSuccess: data => {
			if (!data) return;

			queryClient.setQueryData(["pessoas"], (old: PessoaPageDto) => {
				if (!old) return;
				const updated = old.pessoas.map(pessoa => (pessoa.id === data.id ? data : pessoa));

				return {
					...old,
					pessoas: [...updated],
				};
			});
		},
	});
}

export function useDeletePessoa() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (idparam: number) => {
			await deletePessoa(idparam);
			return idparam;
		},

		onError: e => {
			console.error("Erro ao deletar pessoa:", e);
		},

		onSuccess: idparam => {
			queryClient.setQueryData(["pessoas"], (old: PessoaPageDto) => {
				if (!old) return;
				const updated = old.pessoas.filter(pessoa => pessoa.id !== idparam);
				return {
					...old,
					pessoas: [...updated],
					pageSize: old.pageSize - 1,
					totalElements: old.totalElements - 1,
				};
			});
		},
	});
}
