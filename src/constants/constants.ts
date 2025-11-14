import { z } from "zod";

const env = z
	.object({
		DEV_MODE: z
			.boolean()
			.optional()
			.default(process.env.NODE_ENV === "development"),
		CLIENT_BASE_URL: z.string().optional().default("http://backend:8080/api/v1"),
		NEXT_PUBLIC_BASE_URL: z.string().optional().default("http://backend:8080/api/v1"),
	})
	.parse(process.env);

const clientPrefixs = ["NEXT_PUBLIC_", "CLIENT_"] as const;

type NextPublicEnv<T> = {
	[K in keyof T as K extends `${(typeof clientPrefixs)[number]}${string}` ? K : never]: T[K];
};

const getClientEnv = <T extends Record<string, unknown>>(env: T): NextPublicEnv<T> => {
	const clientEnv = {} as NextPublicEnv<T>;
	Object.entries(env).forEach(([key, value]) => {
		if (clientPrefixs.some(prefix => key.startsWith(prefix))) {
			(clientEnv as Record<string, unknown>)[key] = value;
		}
	});
	return clientEnv;
};

export const clientEnvs = getClientEnv<typeof env>(env);

declare global {
	interface Window {
		__env__: typeof clientEnvs;
	}
}

export const { DEV_MODE, NEXT_PUBLIC_BASE_URL, CLIENT_BASE_URL } = env;
