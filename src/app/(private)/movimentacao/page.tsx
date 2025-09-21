import { CreateMovimentacao } from "./-components/form/MovimentacaoForm";

export default function Movimentacao() {
	return (
		<div className="min-w-full">
			<h1 className="text-3xl text-center font-bold text-custom">Cadastro de Movimentação</h1>
			<CreateMovimentacao />
		</div>
	);
}
