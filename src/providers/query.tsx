"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DEV_MODE } from "@/constants/constants";

const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{DEV_MODE && <ReactQueryDevtools initialIsOpen={false} />}
			{children}
		</QueryClientProvider>
	);
}
