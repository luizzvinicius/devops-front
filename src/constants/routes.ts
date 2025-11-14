export const REDIRECT_WHEN_NOT_AUTHENTICATED = "/login";
export const REDIRECT_WHEN_AUTHENTICATED = "/pessoa";

export const PUBLIC_ROUTES = [{ path: "/login", action: REDIRECT_WHEN_AUTHENTICATED }] as const;

export const PRIVATE_ROUTES = [
	{ path: "/pessoa", action: "next" },
	{ path: "/conta", action: "next" },
	{ path: "/movimentacao", action: "next" },
	{ path: "/investimentos", action: "next" },
] as const;
