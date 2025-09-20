import { jwtDecode } from "jwt-decode";
import type { Token } from "@/models/auth.model";
import { getToken } from "@/service/authService";
import { AUTH_TOKEN } from "@/constants/constants";

export default async function Profile() {
	const token = await getToken(AUTH_TOKEN);
	const decodedToken = jwtDecode(token) as Token;

	return (
		<div className="flex items-center gap-4">
			<div className="flex flex-col justify-center bg-gray-400 rounded-[50%] text-center text-white h-1/2 w-1/2">
				<span>{decodedToken.name.charAt(0).toUpperCase()}</span>
			</div>
			<span className="text-sm">{decodedToken.name}</span>
		</div>
	);
}
