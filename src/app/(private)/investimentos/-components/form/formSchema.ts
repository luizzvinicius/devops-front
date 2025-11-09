import z from "zod";

export const createInvestimentoSchema = z
	.object({
		pessoa_id: z.number().positive("Selecione uma pessoa"),
		conta_id: z.string().nonempty("Selecione uma conta"),
		investimento_id: z.number().positive("Selecione um investimento"),
		aporte: z.number().positive("Valor deve ser maior que 0"),
	})
	.required();

export type CreateInvestimentoType = z.infer<typeof createInvestimentoSchema>;

export const nullFormState: CreateInvestimentoType = {
	pessoa_id: 0,
	conta_id: "",
	investimento_id: 0,
	aporte: 0,
};
