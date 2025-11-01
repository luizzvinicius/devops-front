import "./globals.css";
import { DynamicClientEnvironmentProvider } from "@/providers/dynamic-env";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query";
import { ApiProvider } from "@/providers/api-provider";
import { clientEnvs } from "@/constants/constants";
import { connection } from "next/server";

export const metadata: Metadata = {
	title: "Gestão Bancária",
	description: "Aplicação de gestão bancária para gerenciar movimentações, contas e pessoas.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	await connection()
	return (
		<html lang="pt-BR">
			<body className="min-h-screen flex flex-col bg-gray-100">
				<DynamicClientEnvironmentProvider initialEnv={clientEnvs} />
				<ApiProvider />
				<QueryProvider>
					<Header />
					<main className="flex-grow flex items-center justify-center">
						<section className="w-full max-w-4xl p-4 bg-white shadow-md rounded-2xl">
							{children}
						</section>
						<Toaster richColors position="bottom-right" expand={true} />
					</main>
				</QueryProvider>
			</body>
		</html>
	);
}
