import z from "zod";

export const createPessoaSchema = z
	.object({
		id: z.number(),
		name: z
			.string()
			.min(3, "Nome mínimo de 3 caracteres")
			.max(255, "Nome deve ter no máximo 255 caracteres"),
		cpf: z
			.string()
			.trim()
			.min(14, "O CPF deve ter pelo menos 11 caracteres")
			.transform(cpf => {
				return cpf.replace(/[.-]/g, "");
			}),
		address: z
			.string()
			.min(5, "Endereço mínimo de 5 caracteres")
			.max(255, "Endereço deve ter no máximo 255 caracteres"),
	})
	.required();

export type CreatePessoaType = z.infer<typeof createPessoaSchema>;

export const nullFormState = {
	id: 0,
	name: "",
	cpf: "",
	address: "",
};
