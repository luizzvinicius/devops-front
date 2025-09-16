import "../globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query";
import Profile from "./_components/Profile";

export default function PrivateLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="min-h-screen flex flex-col bg-gray-100">
			<div className="flex">
				<Header />
				<Profile />
			</div>
			<QueryProvider>
				<section className="flex-grow flex items-center justify-center">
					<section className="w-full max-w-4xl p-4 bg-white shadow-md rounded-2xl">
						{children}
					</section>
				</section>
			</QueryProvider>
			<Toaster richColors position="bottom-right" expand={true} />
		</main>
	);
}
