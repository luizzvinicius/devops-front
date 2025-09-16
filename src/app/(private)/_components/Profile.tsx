import type { Token } from "@/models/auth.model";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function Profile() {
	const token = (await cookies()).get("session");
	const decodedToken = jwtDecode(token?.value!) as Token;

	return (
		<div className="flex items-center gap-4 border border-red-400">
			<div className="flex flex-col justify-center bg-gray-400 rounded-[50%] text-center text-white h-1/2 w-1/2 border border-red-400">
				<span>{decodedToken.name.charAt(0).toUpperCase()}</span>
			</div>
			<span className="text-sm">{decodedToken.name}</span>
		</div>
	);
}
