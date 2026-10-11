"use client";
import type { AnyFormApi } from "@tanstack/react-form";
import type { PessoaContaResponse, PessoaEConta } from "@/models/pessoa-model";
import type { PaginationState, OnChangeFn } from "@tanstack/react-table";
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
	pageCount,
	pagination,
	onPaginationChange,
}: {
	pessoaConta: PessoaContaResponse;
	form: AnyFormApi;
	deleteConta: (id: string) => Promise<void>;
	pageCount: number;
	pagination: PaginationState;
	onPaginationChange: OnChangeFn<PaginationState>;
}) {
	const [openDialogId, setOpenDialogId] = useState<string | null>(null);
	const data: ContasTableRow[] =
		pessoaConta.pessoaAndContaDtoList[0]?.nome === ""
			? []
			: pessoaConta.pessoaAndContaDtoList.map(pessoa => ({
				...pessoa,
				form,
			}));

	return (
		<DataTable
			data={data}
			columns={columns(deleteConta, openDialogId, setOpenDialogId)}
			pageCount={pageCount}
			pagination={pagination}
			onPaginationChange={onPaginationChange}
		/>
	);
}
