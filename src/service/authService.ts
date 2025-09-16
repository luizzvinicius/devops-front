import "server-only";
import { cookies } from "next/headers";

export async function createSession(
	access_token: string,
	expires_in: number,
	refresh_token: string,
	refresh_expires_in: number,
) {
	const cookieStore = await cookies();

	cookieStore.set("session", access_token, {
		httpOnly: true,
		secure: true,
		expires: new Date(Date.now() + expires_in * 1000),
		sameSite: "lax",
		path: "/",
	});

	cookieStore.set("refresh_token", refresh_token, {
		httpOnly: true,
		secure: true,
		expires: new Date(Date.now() + refresh_expires_in * 1000),
		sameSite: "lax",
		path: "/",
	});
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete("session");
	cookieStore.delete("refresh_token");
}
