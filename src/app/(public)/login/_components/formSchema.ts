import z from "zod";

export const loginSchema = z
	.object({
		email: z
			.string()
			.email("Email inválido")
			.max(255, "Email deve ter no máximo 255 caracteres"),
		password: z.string(),
	})
	.required();

export type LoginType = z.infer<typeof loginSchema>;

export const nullFormState = {
	email: "",
	password: "",
};
