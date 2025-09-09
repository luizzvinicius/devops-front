import { CreateConta } from "./-components/form/ContaForm";

export default function CreateAccount() {
	return (
		<div className="min-w-full">
			<h1 className="text-3xl text-center font-bold">Cadastro de Conta</h1>
			<CreateConta />
		</div>
	);
}
