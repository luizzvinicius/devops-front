import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPessoa, deletePessoa, getAllPessoas, updatePessoa } from "@/api/pessoas";
import type { PessoaPageDto, PessoaRequestDto } from "@/api/pessoas";

export const useGetPessoas = (page: number) => {
	return useQuery({
		initialData: {
			pessoas: [],
			totalPages: 0,
			totalElements: 0,
		},
		queryKey: ["pessoas"],
		queryFn: async () => {
			const request = await getAllPessoas(page);
			if (!request.data) {
				return Promise.reject();
			}

			return request.data as PessoaPageDto;
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

			queryClient.setQueryData(["pessoas"], (old: PessoaPageDto | undefined) => {
				if (!old) {
					return {
						pessoas: [data],
						totalPages: 1,
						totalElements: 1,
					};
				}

				return {
					...old,
					pessoas: [...old.pessoas, data],
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

			queryClient.setQueryData(["pessoas"], (old: PessoaPageDto | undefined) => {
				if (!old) return;
				const updated = old.pessoas.map(pessoa => (pessoa.id === data.id ? data : pessoa));

				return {
					...old,
					pessoas: [...updated],
					totalElements: old.totalElements + 1,
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
			queryClient.setQueryData(["pessoas"], (old: PessoaPageDto | undefined) => {
				if (!old) return;
				const updated = old.pessoas.filter(pessoa => pessoa.id !== idparam);
				return {
					...old,
					pessoas: [...updated],
					totalElements: old.totalElements + 1,
				};
			});
		},
	});
}
