import { Operacao, type OperacaoValue } from "@/models/movimentacao-model";
import z from "zod";

export const createMovimentacaoSchema = z
	.object({
		pessoa_id: z.number().positive("Selecione uma pessoa"),
		conta_id: z.string().nonempty("Selecione uma conta"),
		valor: z.number().positive("Valor deve ser maior que 0"),
		tipoMovimentacao: z
			.enum(Object.values(Operacao) as [OperacaoValue])
			.or(z.string().nonempty("Selecione um operação")),
	})
	.required();

export type CreateMovimentacaoType = z.infer<typeof createMovimentacaoSchema>;

export const nullFormState: CreateMovimentacaoType = {
	pessoa_id: 0,
	conta_id: "",
	valor: 0,
	tipoMovimentacao: "",
};
