"use server";
import { actionClient } from "@/lib/safe-action";
import { logout as logoutRequest } from "@/api/auth";
import { deleteSession, getToken } from "@/service/authService";
import { redirect } from "next/navigation";
import { REDIRECT_WHEN_NOT_AUTHENTICATED } from "@/constants/routes";
import type { Token } from "@/models/auth.model";
import { jwtDecode } from "jwt-decode";
import { AUTH_TOKEN } from "@/constants/constants";

export const logout = actionClient.action(async () => {
	const token = await getToken(AUTH_TOKEN);
	const decodedToken = jwtDecode(token) as Token;

	await logoutRequest(decodedToken.sub);
	await deleteSession();
	redirect(REDIRECT_WHEN_NOT_AUTHENTICATED);
});
