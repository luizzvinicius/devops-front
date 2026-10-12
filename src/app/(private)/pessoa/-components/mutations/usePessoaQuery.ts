import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPessoa, deletePessoa, getAllPessoas, updatePessoa } from "@/api/pessoas";
import type { PessoaPageDto, PessoaRequestDto } from "@/models/pessoa-model";
import { toast } from "sonner";

const defaultDataGetPessoas = {
	pessoas: [],
	pageSize: 0,
	totalElements: 0,
};
export const useGetPessoas = (page: number) => {
	return useQuery({
		initialData: defaultDataGetPessoas,
		queryKey: ["pessoas", { page: page }],
		queryFn: async () => {
			try {
				return await getAllPessoas(page);
			} catch {
				toast.error("Erro no servidor ao buscar pessoas");
				return defaultDataGetPessoas;
			}
		},
	});
};

export function useCreatePessoa() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createPessoa"],
		mutationFn: async (data: PessoaRequestDto) => await createPessoa(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pessoas"] });
		},
	});
}

export function useUpdatePessoa(page: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["updatePessoa"],
		mutationFn: async ({ idparam, data }: { idparam: number; data: PessoaRequestDto }) =>
			await updatePessoa(idparam, data),

		onSuccess: data => {
			if (!data) return;

			queryClient.setQueryData(["pessoas", { page: page }], (old: PessoaPageDto) => {
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

export function useDeletePessoa(pageIndex: number, onNavigateToPreviousPage: () => void) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (idparam: number) => {
			await deletePessoa(idparam);
			return idparam;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["pessoas"] });

			const currentPageData = queryClient.getQueryData<PessoaPageDto>([
				"pessoas",
				{ page: pageIndex },
			]);

			if (currentPageData?.pessoas.length === 0 && pageIndex > 0) {
				onNavigateToPreviousPage();
			}
		},
	});
}
