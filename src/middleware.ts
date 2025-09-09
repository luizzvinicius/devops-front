import { PRIVATE_ROUTES, PUBLIC_ROUTES, REDIRECT_WHEN_NOT_AUTHENTICATED } from "@/constants/routes";
import { type MiddlewareConfig, type NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
	const token = req.cookies.get("token");

	const currPath = req.nextUrl.pathname;
	const redirectUrl = req.nextUrl.clone();
	const isPublicPath = !PUBLIC_ROUTES.find(route => route.path === currPath);

	if (!token && !isPublicPath) {
		redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
		return NextResponse.redirect(redirectUrl);
	}

	const isPrivatePath = PRIVATE_ROUTES.find(route => route.path === currPath);

	return NextResponse.next();
}

export const config: MiddlewareConfig = {
	matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
};
