"use server";
import { actionClient } from "@/lib/safe-action";
import { login as loginRequest } from "@/api/auth";
import { z } from "zod";
import { createSession } from "@/service/authService";
import { redirect } from "next/navigation";

const inputSchema = z
	.object({
		email: z.string().email().max(255),
		password: z.string().max(100),
	})
	.required();

export const login = actionClient
	.inputSchema(inputSchema)
	.action(async ({ parsedInput: { email, password } }) => {
		const token = await loginRequest(email, password);
		await createSession(
			token.access_token,
			token.expires_in,
			token.refresh_token,
			token.refresh_expires_in,
		);
		redirect("/pessoa");
	});
