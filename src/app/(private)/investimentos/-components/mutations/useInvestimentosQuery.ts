import { createInvestimento, getContaInvestimentos } from "@/api/investimentos";
import { InvestimentoRequestDto, InvestimentoRow } from "@/models/investimento-model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const defaultDataInvestimentosConta = [
	{
		idConta: "",
		tipoInvestimento: 0,
		totalInvestido: 0,
		resgate: new Date(),
	},
] as const;
export const useInvestimentos = (contaId: string) => {
	return useQuery({
		initialData: defaultDataInvestimentosConta,
		queryKey: ["investimentosConta", contaId],
		queryFn: async () => {
			if (contaId.length === 0) {
				return defaultDataInvestimentosConta;
			}
			try {
				return await getContaInvestimentos(contaId);
			} catch {
				toast.error("Erro ao buscar investimentos");
				return defaultDataInvestimentosConta;
			}
		},
	});
};

export function useCreateInvestimento(contaId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["investimentosConta"],
		mutationFn: async (data: InvestimentoRequestDto) => await createInvestimento(data),

		onSuccess: data => {
			if (!data) return;

			queryClient.setQueryData(["investimentosConta", contaId], (old: InvestimentoRow[]) => {
				const investimento = {
					idConta: contaId,
					tipoInvestimento: data.tipoInvestimento,
					totalInvestido: data.totalInvestido,
					resgate: data.resgate,
				};

				if (old.length === 0) {
					[investimento];
				}

				return [investimento, ...old];
			});
		},
	});
}
