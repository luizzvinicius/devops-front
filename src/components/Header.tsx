import Link from "next/link";

export function Header() {
	return (
		<nav className="flex self-start w-full p-4 gap-2">
			<Link href="/pessoa" className="hover:underline hover:text-blue-400">
				Pessoa
			</Link>
			<p className="text-gray-500">|</p>
			<Link href="/conta" className="hover:underline hover:text-blue-400">
				Conta
			</Link>
			<p className="text-gray-500">|</p>
			<Link href="/movimentacao" className="hover:underline hover:text-blue-400">
				Movimentação
			</Link>
		</nav>
	);
}
