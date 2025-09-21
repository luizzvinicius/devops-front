import { jwtDecode } from "jwt-decode";
import type { Token } from "@/models/auth.model";
import { getToken } from "@/service/authService";
import { AUTH_TOKEN } from "@/constants/constants";

export default async function Profile() {
	const token = await getToken(AUTH_TOKEN);
	const decodedToken = jwtDecode(token) as Token;

	return (
		<div className="flex items-center gap-4 shadow-md rounded-2xl px-4 bg-[#f7f9fb]">
			<div className="h-8 w-8 flex justify-center items-center rounded-[50%] bg-background-secondary">
				<span className="text-custom">
					{decodedToken.name.charAt(0).toLocaleUpperCase()}
				</span>
			</div>
			<span className="text-sm">{decodedToken.name}</span>
		</div>
	);
}
