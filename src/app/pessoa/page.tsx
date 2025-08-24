"use client";
import { CreatePessoaForm } from "./-components/CreatePessoaForm";
import QueryProvider from "@/providers/tsQuery";

export default function Pessoa() {
	return (
		<QueryProvider>
			<div className="min-w-full">
				<h1 className="text-3xl text-center font-bold">Cadastro de Pessoa</h1>
				<CreatePessoaForm />
			</div>
		</QueryProvider>
	);
}
