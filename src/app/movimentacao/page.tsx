import QueryProvider from "@/providers/tsQuery";
import { CreateMovimentacao } from "./-components/CreateMovimentacaoForm";

export default function Movimentacao() {
	return (
		<QueryProvider>
			<div className="min-w-full">
				<h1 className="text-3xl text-center font-bold">Cadastro de Movimentação</h1>
				<CreateMovimentacao />
			</div>
		</QueryProvider>
	);
}
