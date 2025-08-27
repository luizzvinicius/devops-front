import z from "zod";

export const createContaSchema = z
	.object({
		id: z.number().positive("Nenhuma pessoa selecionada"),
	})
	.required();

export const nullFormState = {
	id: 0,
};
