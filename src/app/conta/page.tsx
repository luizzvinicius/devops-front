import QueryProvider from "@/providers/tsQuery";
import { CreateConta } from "./-components/createConta";

export default function CreateAccount() {
	return (
		<QueryProvider>
			<div className="min-w-full">
				<h1 className="text-3xl text-center font-bold">Cadastro de Conta</h1>
				<CreateConta />
			</div>
		</QueryProvider>
	);
}
