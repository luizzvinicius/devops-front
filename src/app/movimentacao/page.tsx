import QueryProvider from "@/providers/tsQuery";
import { CreateMovimentacao } from "./-components/form/MovimentacaoForm";

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
