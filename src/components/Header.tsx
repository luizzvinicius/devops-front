import Link from "next/link";

export function Header() {
	return (
		<nav className="flex self-start w-full p-4 gap-2">
			<Link href="/pessoa" className="text-custom hover:underline hover:text-blue-400">
				Pessoa
			</Link>
			<p className="text-custom">|</p>
			<Link href="/conta" className="text-custom hover:underline hover:text-blue-400">
				Conta
			</Link>
			<p className="text-custom">|</p>
			<Link href="/movimentacao" className="text-custom hover:underline hover:text-blue-400">
				Movimentação
			</Link>
		</nav>
	);
}
