"use client";
import type { AnyFormApi } from "@tanstack/react-form";
import type { ContaMovimentacoesDto, ContaMovimentacoesResponseDto } from "@/models/conta-model";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";

type MovimentacoesTableRow = ContaMovimentacoesDto & {
	form: AnyFormApi;
};

export default function MovimentacoesTable({
	contaMovimentacoes,
	form,
	pageCount,
	pagination,
	onPaginationChange,
}: {
	contaMovimentacoes: ContaMovimentacoesResponseDto;
	form: AnyFormApi;
	pageCount: number;
	pagination: PaginationState;
	onPaginationChange: OnChangeFn<PaginationState>;
}) {
	const data: MovimentacoesTableRow[] = contaMovimentacoes.contaMovimentacoes.map(mov => ({
		...mov,
		form,
	}));

	return (
		<DataTable
			data={data}
			columns={columns}
			pageCount={pageCount}
			pagination={pagination}
			onPaginationChange={onPaginationChange}
		/>
	);
}
