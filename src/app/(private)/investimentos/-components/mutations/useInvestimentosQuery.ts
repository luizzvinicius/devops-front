import { createInvestimento, getContaInvestimentos } from "@/api/investimentos";
import type { InvestimentoRequestDto, InvestimentoRow } from "@/models/investimento-model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const defaultDataInvestimentosConta: InvestimentoRow[] = [
	{
		idConta: "",
		idInvestimento: 0,
		taxa: 0,
		dataInicio: new Date(20, 5, 2000),
		tipoInvestimento: "0",
		totalInvestido: 0,
		resgate: new Date(20, 5, 2000),
	},
];
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
				const investimento: InvestimentoRow = {
					idConta: contaId,
					tipoInvestimento: data.tipoInvestimento,
					totalInvestido: data.totalInvestido,
					resgate: data.resgate,
					dataInicio: data.dataInicio,
					idInvestimento: data.idInvestimento,
					taxa: data.taxa,
				};

				if (old.length === 0) {
					return [investimento];
				}

				return [investimento, ...old];
			});
		},
	});
}
