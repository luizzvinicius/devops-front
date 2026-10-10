"use client";
import type { AnyFormApi } from "@tanstack/react-form";
import type { PessoaEConta } from "@/models/pessoa-model";
import { useState } from "react";
import { columns } from "./columns"
import { DataTable } from "./data-table"

type ContasTableRow = PessoaEConta & {
	form: AnyFormApi;
};

export default function ContasTable({
	pessoaConta,
	form,
	deleteConta,
}: {
	pessoaConta: PessoaEConta[];
	form: AnyFormApi;
	deleteConta: (id: string) => Promise<void>;
}) {
	const [openDialogId, setOpenDialogId] = useState<string | null>(null);
	const dataMock = [
		{
			id: 1,
			endereco: "qualquer",
			nome: "Vinicius",
			cpf: "12345678901",
			conta_id: "123456",
			conta_saldo: 1000,
			form,
		},
		{
			id: 2,
			endereco: "nenhum",
			nome: "Ana",
			cpf: "1234568748",
			conta_id: "1234564",
			conta_saldo: 3000,
			form,
		},
	]
	const data: ContasTableRow[] =
		pessoaConta[0]?.nome === ""
			? []
			: pessoaConta.map(pessoa => ({
				...pessoa,
				form,
			}));

	return (
		<DataTable data={dataMock} columns={columns(deleteConta, openDialogId, setOpenDialogId)} />
	);
}
