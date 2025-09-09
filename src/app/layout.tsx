import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Gestão Bancária",
	description: "Aplicação de gestão bancária para gerenciar movimentações, contas e pessoas.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body>{children}</body>
		</html>
	);
}
