import { Toaster } from "@/components/ui/sonner";

export default function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main>
			{children}
			<Toaster richColors position="bottom-right" expand={true} />
		</main>
	);
}
