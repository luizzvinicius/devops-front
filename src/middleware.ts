import {
	PRIVATE_ROUTES,
	REDIRECT_WHEN_AUTHENTICATED,
	REDIRECT_WHEN_NOT_AUTHENTICATED,
} from "@/constants/routes";
import { type MiddlewareConfig, type NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
	const currPath = req.nextUrl.pathname;
	const redirectUrl = req.nextUrl.clone();
	const token = req.cookies.get("session");

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
