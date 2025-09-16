import {
	PRIVATE_ROUTES,
	PUBLIC_ROUTES,
	REDIRECT_WHEN_AUTHENTICATED,
	REDIRECT_WHEN_NOT_AUTHENTICATED,
} from "@/constants/routes";
import { type MiddlewareConfig, type NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req: NextRequest) {
	console.log("middleware activated");

	const currPath = req.nextUrl.pathname;
	const redirectUrl = req.nextUrl.clone();
	const token = req.cookies.get("session");
	if (token !== undefined) console.log(jwtDecode(token.value));

	if (currPath === "/" && !token) {
		return NextResponse.redirect(redirectUrl.origin + REDIRECT_WHEN_NOT_AUTHENTICATED);
	}
	if ((currPath === "/" || currPath === "/login") && token) {
		return NextResponse.redirect(redirectUrl.origin + REDIRECT_WHEN_AUTHENTICATED);
	}

	const isPrivatePath = PRIVATE_ROUTES.find(route => route.path === currPath);

	if (isPrivatePath && !token) {
		return NextResponse.redirect(redirectUrl.origin + REDIRECT_WHEN_NOT_AUTHENTICATED);
	}

	return NextResponse.next();
}

export const config: MiddlewareConfig = {
	matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
};
