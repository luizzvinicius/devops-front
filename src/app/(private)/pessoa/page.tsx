import { CreatePessoaForm } from "./-components/form/PessoaForm";

export default function Pessoa() {
	return (
		<div className="min-w-full">
			<h1 className="text-3xl text-center font-bold">Cadastro de Pessoa</h1>
			<CreatePessoaForm />
		</div>
	);
}
